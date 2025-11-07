// src/services/AgendaService.ts
import api from "@/lib/api"

// Interfaces baseadas no backend Java
export interface Agenda {
    id: number
    descricao: string
    horario: string
    dataCriacao: string
    paciente: Paciente
    tempoConsultaMinutos: number
    horarioFim?: string
}

export interface Paciente {
    id: number
    nome: string
    telefone?: string
    email?: string
    cpf?: string
    dataNascimento?: string
}

export interface AgendaRequest {
    descricao: string
    horario: string
    pacienteId: number
    tempoConsultaMinutos: number
}

export interface AgendaResponse {
    id: number
    descricao: string
    horario: string
    dataCriacao: string
    paciente: PacienteResponse
    tempoConsultaMinutos: number
    horarioFim: string
}

export interface PacienteResponse {
    id: number
    nome: string
    telefone?: string
    email?: string
}

// Interface para temporário (quando não há paciente cadastrado)
export interface AgendaTemporariaRequest {
    descricao: string
    horario: string
    pacienteNome: string
    pacienteTelefone?: string
    pacienteEmail?: string
    tempoConsultaMinutos: number
}

// Tipos de tempo de consulta disponíveis
export enum TempoConsulta {
    VINTE_MINUTOS = 20,
    TRINTA_MINUTOS = 30,
    UMA_HORA = 60,
    DUAS_HORAS = 120,
    TRES_HORAS = 180
}

class AgendaService {
    private baseURL = "/agenda"

    // Buscar todos os agendamentos
    async getAgendamentos(): Promise<Agenda[]> {
        try {
            const response = await api.get(this.baseURL)
            return response.data.map(this.mapAgendaResponseToAgenda)
        } catch (error: any) {
            console.error("Erro ao buscar agendamentos:", error)
            const errorMessage = error.response?.data?.message || "Erro ao carregar agendamentos"
            throw new Error(errorMessage)
        }
    }

    // Buscar agendamento por ID
    async getAgendamentoById(id: number): Promise<Agenda> {
        try {
            const response = await api.get(`${this.baseURL}/${id}`)
            return this.mapAgendaResponseToAgenda(response.data)
        } catch (error: any) {
            console.error(`Erro ao buscar agendamento ${id}:`, error)
            const errorMessage = error.response?.data?.message || "Erro ao carregar agendamento"
            throw new Error(errorMessage)
        }
    }

    // Buscar agendamentos por paciente
    async getAgendamentosPorPaciente(pacienteId: number): Promise<Agenda[]> {
        try {
            const response = await api.get(`${this.baseURL}/paciente/${pacienteId}`)
            return response.data.map(this.mapAgendaResponseToAgenda)
        } catch (error: any) {
            console.error(`Erro ao buscar agendamentos do paciente ${pacienteId}:`, error)
            const errorMessage = error.response?.data?.message || "Erro ao carregar agendamentos do paciente"
            throw new Error(errorMessage)
        }
    }

    // Buscar agendamentos por período
    async getAgendamentosPorPeriodo(inicio: string, fim: string): Promise<Agenda[]> {
        try {
            const response = await api.get(`${this.baseURL}/periodo`, {
                params: { inicio, fim }
            })
            return response.data.map(this.mapAgendaResponseToAgenda)
        } catch (error: any) {
            console.error("Erro ao buscar agendamentos por período:", error)
            const errorMessage = error.response?.data?.message || "Erro ao carregar agendamentos do período"
            throw new Error(errorMessage)
        }
    }

    // Criar agendamento
    async createAgendamento(agendamento: AgendaRequest): Promise<Agenda> {
        try {
            // Validar tempo de consulta
            if (!this.isTempoConsultaValido(agendamento.tempoConsultaMinutos)) {
                throw new Error("Tempo de consulta inválido")
            }

            const response = await api.post(this.baseURL, agendamento)
            return this.mapAgendaResponseToAgenda(response.data)
        } catch (error: any) {
            console.error("Erro ao criar agendamento:", error)
            const errorMessage = error.response?.data?.message || "Erro ao criar agendamento"
            throw new Error(errorMessage)
        }
    }

    // Criar agendamento temporário (sem paciente cadastrado)
    async createAgendamentoTemporario(agendamento: AgendaTemporariaRequest): Promise<Agenda> {
        try {
            // Validar tempo de consulta
            if (!this.isTempoConsultaValido(agendamento.tempoConsultaMinutos)) {
                throw new Error("Tempo de consulta inválido")
            }

            // Primeiro criar um paciente temporário, depois o agendamento
            // Esta é uma simplificação - você pode precisar ajustar conforme sua lógica de negócio
            const pacienteResponse = await api.post("/pacientes", {
                nome: agendamento.pacienteNome,
                telefone: agendamento.pacienteTelefone,
                email: agendamento.pacienteEmail
            })

            const agendaRequest: AgendaRequest = {
                descricao: agendamento.descricao,
                horario: agendamento.horario,
                pacienteId: pacienteResponse.data.id,
                tempoConsultaMinutos: agendamento.tempoConsultaMinutos
            }

            return await this.createAgendamento(agendaRequest)
        } catch (error: any) {
            console.error("Erro ao criar agendamento temporário:", error)
            const errorMessage = error.response?.data?.message || "Erro ao criar agendamento temporário"
            throw new Error(errorMessage)
        }
    }

    // Atualizar agendamento
    async updateAgendamento(id: number, agendamento: Partial<AgendaRequest>): Promise<Agenda> {
        try {
            if (agendamento.tempoConsultaMinutos && !this.isTempoConsultaValido(agendamento.tempoConsultaMinutos)) {
                throw new Error("Tempo de consulta inválido")
            }

            const response = await api.put(`${this.baseURL}/${id}`, agendamento)
            return this.mapAgendaResponseToAgenda(response.data)
        } catch (error: any) {
            console.error(`Erro ao atualizar agendamento ${id}:`, error)
            const errorMessage = error.response?.data?.message || "Erro ao atualizar agendamento"
            throw new Error(errorMessage)
        }
    }

    // Excluir agendamento
    async deleteAgendamento(id: number): Promise<void> {
        try {
            await api.delete(`${this.baseURL}/${id}`)
        } catch (error: any) {
            console.error(`Erro ao excluir agendamento ${id}:`, error)
            const errorMessage = error.response?.data?.message || "Erro ao excluir agendamento"
            throw new Error(errorMessage)
        }
    }

    // Buscar pacientes
    async getPacientes(search?: string): Promise<Paciente[]> {
        try {
            const response = await api.get("/pacientes", {
                params: { search }
            })
            return response.data
        } catch (error: any) {
            console.error("Erro ao buscar pacientes:", error)
            const errorMessage = error.response?.data?.message || "Erro ao carregar pacientes"
            throw new Error(errorMessage)
        }
    }

    // Buscar tempos de consulta disponíveis
    async getTemposConsultaDisponiveis(): Promise<{ minutos: number, label: string }[]> {
        try {
            const response = await api.get(`${this.baseURL}/tempos-consulta`)
            return response.data.map((tempo: any) => ({
                minutos: tempo.minutos,
                label: this.formatarTempoConsulta(tempo.minutos)
            }))
        } catch (error: any) {
            console.error("Erro ao buscar tempos de consulta:", error)
            // Fallback para tempos padrão
            return [
                { minutos: 20, label: "20 minutos" },
                { minutos: 30, label: "30 minutos" },
                { minutos: 60, label: "1 hora" },
                { minutos: 120, label: "2 horas" },
                { minutos: 180, label: "3 horas" }
            ]
        }
    }

    // Buscar horários de funcionamento
    async getHorariosFuncionamento(): Promise<Record<string, string>> {
        try {
            const response = await api.get(`${this.baseURL}/horarios-funcionamento`)
            return response.data
        } catch (error: any) {
            console.error("Erro ao buscar horários de funcionamento:", error)
            // Fallback
            return {
                "Segunda-feira": "8h-12h e 13h-18h",
                "Terça-feira": "8h-12h e 13h-18h",
                "Quarta-feira": "8h-12h e 13h-18h",
                "Quinta-feira": "8h-12h e 13h-18h",
                "Sexta-feira": "8h-12h e 13h-18h",
                "Sábado": "8h-12h",
                "Domingo": "Fechado"
            }
        }
    }

    // Verificar disponibilidade de horário
    async verificarDisponibilidade(horario: string, tempoConsultaMinutos: number): Promise<boolean> {
        try {
            // Esta verificação seria mais complexa no backend
            // Por enquanto, vamos verificar se há conflitos com agendamentos existentes
            const agendamentos = await this.getAgendamentosPorPeriodo(
                horario,
                new Date(new Date(horario).getTime() + tempoConsultaMinutos * 60000).toISOString()
            )

            return agendamentos.length === 0
        } catch (error: any) {
            console.error("Erro ao verificar disponibilidade:", error)
            return true // Em caso de erro, assume que está disponível
        }
    }

    // Métodos auxiliares
    private mapAgendaResponseToAgenda(response: AgendaResponse): Agenda {
        return {
            id: response.id,
            descricao: response.descricao,
            horario: response.horario,
            dataCriacao: response.dataCriacao,
            paciente: response.paciente,
            tempoConsultaMinutos: response.tempoConsultaMinutos,
            horarioFim: response.horarioFim
        }
    }

    private isTempoConsultaValido(minutos: number): boolean {
        const temposValidos = [20, 30, 60, 120, 180]
        return temposValidos.includes(minutos)
    }

    private formatarTempoConsulta(minutos: number): string {
        if (minutos < 60) {
            return `${minutos} minutos`
        } else if (minutos === 60) {
            return "1 hora"
        } else {
            return `${minutos / 60} horas`
        }
    }

    // Utilitários para o frontend
    formatarDataHora(dataHora: string): string {
        if (!dataHora) return "N/A"

        try {
            const date = new Date(dataHora)
            if (isNaN(date.getTime())) return "N/A"

            return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString(
                "pt-BR",
                { hour: "2-digit", minute: "2-digit" }
            )}`
        } catch {
            return "N/A"
        }
    }

    formatarDuracao(minutos: number): string {
        if (minutos < 60) {
            return `${minutos} min`
        } else if (minutos === 60) {
            return "1h"
        } else {
            return `${minutos / 60}h`
        }
    }

    calcularHorarioFim(horario: string, tempoConsultaMinutos: number): string {
        const date = new Date(horario)
        date.setMinutes(date.getMinutes() + tempoConsultaMinutos)
        return date.toISOString()
    }

    // Gerar horários disponíveis para um dia
    gerarHorariosDisponiveisDia(data: Date): string[] {
        const horarios: string[] = []
        const diaSemana = data.getDay()

        // Sábado: 8h-12h
        if (diaSemana === 6) {
            for (let hour = 8; hour < 12; hour++) {
                horarios.push(`${hour.toString().padStart(2, '0')}:00`)
            }
        }
        // Dias de semana: 8h-12h e 13h-18h
        else if (diaSemana >= 1 && diaSemana <= 5) {
            // Manhã
            for (let hour = 8; hour < 12; hour++) {
                horarios.push(`${hour.toString().padStart(2, '0')}:00`)
            }
            // Tarde
            for (let hour = 13; hour < 18; hour++) {
                horarios.push(`${hour.toString().padStart(2, '0')}:00`)
            }
        }

        return horarios
    }

    // Verificar se data é válida para agendamento
    isDataValidaParaAgendamento(data: Date): boolean {
        const diaSemana = data.getDay()
        // Segunda a Sábado são válidos
        return diaSemana >= 1 && diaSemana <= 6
    }
}

export const agendaService = new AgendaService()