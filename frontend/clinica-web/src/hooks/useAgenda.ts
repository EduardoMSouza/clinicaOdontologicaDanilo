// hooks/useAgenda.ts
import { useState, useCallback } from 'react';
import { agendaService,
    AgendaCreateDTO,
    AgendaUpdateDTO,
    AgendaStatusUpdateDTO,
    AgendaResponseDTO,
    AgendaListDTO,
    DisponibilidadeRequestDTO,
    ProximoHorarioResponseDTO } from '@/services/agendaService';

export const useAgenda = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const criarAgendamento = useCallback(async (dto: AgendaCreateDTO): Promise<AgendaResponseDTO> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.criar(dto);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar agendamento';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const listarAgendamentos = useCallback(async (): Promise<AgendaListDTO[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.listar();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar agendamentos';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const listarPorDentista = useCallback(async (dentistaId: number): Promise<AgendaListDTO[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.listarPorDentista(dentistaId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar agendamentos do dentista';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const listarPorPaciente = useCallback(async (pacienteId: number): Promise<AgendaListDTO[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.listarPorPaciente(pacienteId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar agendamentos do paciente';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const atualizarAgendamento = useCallback(async (id: number, dto: AgendaUpdateDTO): Promise<AgendaResponseDTO> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.atualizar(id, dto);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao atualizar agendamento';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const atualizarStatus = useCallback(async (id: number, dto: AgendaStatusUpdateDTO): Promise<AgendaResponseDTO> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.atualizarStatus(id, dto);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao atualizar status';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletarAgendamento = useCallback(async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await agendaService.deletar(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao excluir agendamento';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const verificarDisponibilidade = useCallback(async (dto: DisponibilidadeRequestDTO): Promise<string[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.verificarDisponibilidade(dto);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao verificar disponibilidade';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarProximoHorario = useCallback(async (dentistaId: number): Promise<ProximoHorarioResponseDTO | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await agendaService.buscarProximoHorario(dentistaId);
            return response;
        } catch (err: any) {
            // Não é erro se não encontrar próximo horário
            setError(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        criarAgendamento,
        listarAgendamentos,
        listarPorDentista,
        listarPorPaciente,
        atualizarAgendamento,
        atualizarStatus,
        deletarAgendamento,
        verificarDisponibilidade,
        buscarProximoHorario,
    };
};