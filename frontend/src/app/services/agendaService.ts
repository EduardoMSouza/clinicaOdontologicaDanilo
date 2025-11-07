import api from "@/lib/api"

export interface PacienteResumo {
    id: number
    nome: string
    cpf?: string
    email?: string
    telefone?: string
    dataNascimento?: string
}

export interface AgendaResponse {
    id: number
    descricao: string
    horario: string        // ISO vindo do backend
    dataCriacao: string    // ISO
    paciente: PacienteResumo
    tempoConsultaMinutos: number
    horarioFim: string     // ISO
}

export interface AgendaCreateRequest {
    descricao: string
    horario: string              // "yyyy-MM-dd'T'HH:mm"
    pacienteId: number
    tempoConsultaMinutos: number
}

export interface TempoConsulta {
    minutos: number
    label: string
}

const BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/agenda`

export const agendaService = {
    async list(): Promise<AgendaResponse[]> {
        const { data } = await api.get(BASE)
        return data
    },

    async get(id: number): Promise<AgendaResponse> {
        const { data } = await api.get(`${BASE}/${id}`)
        return data
    },

    async create(payload: AgendaCreateRequest): Promise<AgendaResponse> {
        const { data } = await api.post(BASE, payload)
        return data
    },

    async remove(id: number): Promise<void> {
        await api.delete(`${BASE}/${id}`)
    },

    async listByPaciente(pacienteId: number): Promise<AgendaResponse[]> {
        const { data } = await api.get(`${BASE}/paciente/${pacienteId}`)
        return data
    },

    async temposConsulta(): Promise<TempoConsulta[]> {
        const { data } = await api.get(`${BASE}/tempos-consulta`)
        return data
    },

    async horariosFuncionamento(): Promise<Record<string, string>> {
        const { data } = await api.get(`${BASE}/horarios-funcionamento`)
        return data
    },
}
