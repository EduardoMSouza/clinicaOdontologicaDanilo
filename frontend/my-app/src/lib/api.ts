const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`,
    {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    }
  )

  const contentType = response.headers.get("content-type") ?? ""
  const isJson = contentType.includes("application/json")
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === "string" || payload === null
      ? payload || `Erro ${response.status}`
      : payload.message ?? `Erro ${response.status}`
    throw new Error(message)
  }

  return (payload ?? undefined) as T
}

export interface PacienteResponse {
  id: number
  nome: string
  cpf: string | null
  telefone: string | null
  email: string | null
}

export interface PacienteRequest {
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  dataNascimento?: string
}

export interface DentistaResponse {
  id: number
  nome: string
  cro: string
  email?: string | null
  telefone?: string | null
}

export interface AgendaResponse {
  id: number
  pacienteId: number
  pacienteNome: string
  dentistaId: number
  dentistaNome: string
  dataHora: string
  status: string
  observacoes?: string | null
}

export interface AgendaRequest {
  pacienteId: number
  dentistaId: number
  dataHora: string
  observacoes?: string
}

export function listarPacientes() {
  return apiRequest<PacienteResponse[]>("/api/pacientes")
}

export function criarPaciente(data: PacienteRequest) {
  return apiRequest<PacienteResponse>("/api/pacientes", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function removerPaciente(id: number) {
  return apiRequest<void>(`/api/pacientes/${id}`, { method: "DELETE" })
}

export function listarDentistas() {
  return apiRequest<DentistaResponse[]>("/api/dentistas")
}

export function listarAgendamentos() {
  return apiRequest<AgendaResponse[]>("/api/agendamentos")
}

export function criarAgendamento(data: AgendaRequest) {
  return apiRequest<AgendaResponse>("/api/agendamentos", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function atualizarStatusAgendamento(id: number, status: string) {
  const params = new URLSearchParams({ status })
  return apiRequest<AgendaResponse>(`/api/agendamentos/${id}/status?${params.toString()}`, {
    method: "PATCH",
  })
}
