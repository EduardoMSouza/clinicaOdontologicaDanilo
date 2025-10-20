const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "")

async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
        },
    })

    if (!response.ok) {
        let message = `Erro ${response.status}`

        try {
            const errorBody = await response.json() as { message?: string }
            if (errorBody?.message) {
                message = errorBody.message
            }
        } catch {
            const fallback = await response.text().catch(() => "")
            if (fallback) {
                message = fallback
            }
        }

        throw new Error(message)
    }

    if (response.status === 204) {
        return null as T
    }

    return response.json() as Promise<T>
}

export interface PacienteDTO {
    id: number
    nome: string
    cpf: string | null
    telefone: string | null
    email: string | null
}

export interface AgendaDTO {
    id: number
    pacienteId: number
    pacienteNome: string
    dentistaId: number
    dentistaNome: string
    dataHora: string
    status: string
    observacoes: string | null
}

export async function getPacientes(): Promise<PacienteDTO[]> {
    return fetchJson<PacienteDTO[]>("/api/pacientes")
}

export async function getAgendamentos(): Promise<AgendaDTO[]> {
    return fetchJson<AgendaDTO[]>("/api/agendamentos")
}

export { API_BASE_URL }
