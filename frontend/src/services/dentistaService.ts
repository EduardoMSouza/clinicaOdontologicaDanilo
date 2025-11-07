// src/services/dentistaService.ts
import api from "@/lib/api"

export interface Dentista {
    id: number
    nome: string
    cro: string
    especialidade?: string
    telefone?: string
    email?: string
    ativo: boolean
}

export interface DentistaRequest {
    nome: string
    cro: string
    especialidade?: string
    telefone?: string
    email?: string
    ativo?: boolean
}

const BASE_URL: string = '/dentista'

export const dentistaService = {
    // Buscar todos os dentistas
    async getDentistas(): Promise<Dentista[]> {
        const response = await api.get(BASE_URL)
        return response.data
    },

    // Buscar dentista por ID
    async getDentistaById(id: number): Promise<Dentista> {
        const response = await api.get(`${BASE_URL}/${id}`)
        return response.data
    },

    // Criar dentista
    async createDentista(dentista: DentistaRequest): Promise<Dentista> {
        const response = await api.post(BASE_URL, dentista)
        return response.data
    },

    // Atualizar dentista
    async updateDentista(id: number, dentista: DentistaRequest): Promise<Dentista> {
        const response = await api.put(`${BASE_URL/${id}`, dentista)
        return response.data
    },

    // Excluir dentista
    async deleteDentista(id: number): Promise<void> {
        await api.delete(`/dentista/${id}`)
    },

    // Buscar dentistas ativos (opcional)
    async getDentistasAtivos(): Promise<Dentista[]> {
        const response = await api.get("/dentista", {
            params: { ativo: true }
        })
        return response.data
    }
}