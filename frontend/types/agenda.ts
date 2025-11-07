// types/agenda.ts
export interface AgendaRequestDTO {
    dentistaId: number;
    pacienteId: number;
    dataHora: string;
    procedimento?: string;
    observacoes?: string;
}

export interface AgendaResponseDTO {
    id: number;
    dentistaId: number;
    pacienteId: number;
    dataHora: string;
    procedimento?: string;
    observacoes?: string;
    status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';
    createdAt: string;
    updatedAt: string;
}

export interface DisponibilidadeRequestDTO {
    dentistaId: number;
    dataHora: string;
    duracaoMinutos?: number;
}

export interface ProximoHorarioResponseDTO {
    dataHora: string;
    disponivel: boolean;
}