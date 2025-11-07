import api from "@/lib/api";

export interface Dentista {
    id: number;
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo: boolean;
}

export interface DentistaRequest {
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo?: boolean;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/dentista`;

export const dentistaService = {
    // ✅ Buscar todos os dentistas
    async getDentistas(): Promise<Dentista[]> {
        try {
            const { data } = await api.get(BASE_URL);
            return data;
        } catch (error) {
            console.error("Erro ao buscar dentistas:", error);
            throw error;
        }
    },

    // ✅ Buscar dentista por ID
    async getDentistaById(id: number): Promise<Dentista> {
        try {
            const { data } = await api.get(`${BASE_URL}/${id}`);
            return data;
        } catch (error) {
            console.error(`Erro ao buscar dentista ID ${id}:`, error);
            throw error;
        }
    },

    // ✅ Criar dentista
    async createDentista(dentista: DentistaRequest): Promise<Dentista> {
        try {
            const { data } = await api.post(BASE_URL, dentista);
            return data;
        } catch (error) {
            console.error("Erro ao criar dentista:", error);
            throw error;
        }
    },

    // ✅ Atualizar dentista
    async updateDentista(id: number, dentista: DentistaRequest): Promise<Dentista> {
        try {
            const { data } = await api.put(`${BASE_URL}/${id}`, dentista);
            return data;
        } catch (error) {
            console.error(`Erro ao atualizar dentista ID ${id}:`, error);
            throw error;
        }
    },

    // ✅ Excluir dentista
    async deleteDentista(id: number): Promise<void> {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Erro ao excluir dentista ID ${id}:`, error);
            throw error;
        }
    },

    // ✅ Buscar dentistas ativos
    async getDentistasAtivos(): Promise<Dentista[]> {
        try {
            const { data } = await api.get(BASE_URL, { params: { ativo: true } });
            return data;
        } catch (error) {
            console.error("Erro ao buscar dentistas ativos:", error);
            throw error;
        }
    },
};
