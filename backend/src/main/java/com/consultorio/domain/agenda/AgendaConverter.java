// AgendaConverter.java
package com.consultorio.domain.agenda.dto;

import com.consultorio.domain.agenda.Agenda;
import com.consultorio.domain.agenda.dto.*;
import org.springframework.stereotype.Component;

@Component
public class AgendaConverter {

    // ========== ENTRADAS ==========

    public AgendaConvert fromEntity(Agenda agenda) {
        return new AgendaConvert(agenda);
    }

    public AgendaConvert fromCreate(AgendaCreateDTO dto) {
        return new AgendaConvert(dto);
    }

    public AgendaConvert fromUpdate(AgendaUpdateDTO dto) {
        return new AgendaConvert(dto);
    }

    public AgendaConvert fromStatusUpdate(AgendaStatusUpdateDTO dto) {
        return new AgendaConvert(dto);
    }

    // ========== CLASSE DE CONVERSÃO ==========

    public static class AgendaConvert {
        private Agenda agenda;
        private AgendaCreateDTO createDTO;
        private AgendaUpdateDTO updateDTO;
        private AgendaStatusUpdateDTO statusUpdateDTO;

        // Constructor para Entity → DTO
        public AgendaConvert(Agenda agenda) {
            this.agenda = agenda;
        }

        // Constructor para CreateDTO → Entity
        public AgendaConvert(AgendaCreateDTO createDTO) {
            this.createDTO = createDTO;
        }

        // Constructor para UpdateDTO → Entity
        public AgendaConvert(AgendaUpdateDTO updateDTO) {
            this.updateDTO = updateDTO;
        }

        // Constructor para StatusUpdateDTO → Entity
        public AgendaConvert(AgendaStatusUpdateDTO statusUpdateDTO) {
            this.statusUpdateDTO = statusUpdateDTO;
        }

        // ========== CONVERSÕES PARA DTO ==========

        public AgendaResponseDTO toResponse() {
            validateEntity();

            return AgendaResponseDTO.builder()
                    .id(agenda.getId())
                    .pacienteId(agenda.getPacienteId())
                    .pacienteNome(agenda.getPacienteNome())
                    .dentistaId(agenda.getDentistaId())
                    .dentistaNome(agenda.getDentistaNome())
                    .dataHora(agenda.getDataHora())
                    .status(agenda.getStatus())
                    .observacoes(agenda.getObservacoes())
                    .telefone(agenda.getTelefone())
                    .email(agenda.getEmail())
                    .dataCadastro(agenda.getDataCadastro())
                    .build();
        }

        public AgendaListDTO toList() {
            validateEntity();

            return AgendaListDTO.builder()
                    .id(agenda.getId())
                    .pacienteNome(agenda.getPacienteNome())
                    .dentistaNome(agenda.getDentistaNome())
                    .dataHora(agenda.getDataHora())
                    .status(agenda.getStatus())
                    .telefone(agenda.getTelefone())
                    .build();
        }

        public ProximoHorarioResponseDTO toProximoHorario() {
            validateEntity();

            return ProximoHorarioResponseDTO.builder()
                    .dataHora(agenda.getDataHora())
                    .dentistaNome(agenda.getDentistaNome())
                    .pacienteNome(agenda.getPacienteNome())
                    .build();
        }

        // ========== CONVERSÕES PARA ENTITY ==========

        public Agenda toEntity() {
            if (createDTO != null) {
                return fromCreateDTO();
            }
            throw new IllegalStateException("Nenhum DTO disponível para conversão");
        }

        public void updateEntity(Agenda agenda) {
            if (updateDTO == null) {
                throw new IllegalStateException("UpdateDTO não disponível");
            }

            if (updateDTO.pacienteId() != null) agenda.setPacienteId(updateDTO.pacienteId());
            if (updateDTO.pacienteNome() != null) agenda.setPacienteNome(updateDTO.pacienteNome());
            if (updateDTO.dentistaId() != null) agenda.setDentistaId(updateDTO.dentistaId());
            if (updateDTO.dentistaNome() != null) agenda.setDentistaNome(updateDTO.dentistaNome());
            if (updateDTO.dataHora() != null) agenda.setDataHora(updateDTO.dataHora());
            if (updateDTO.observacoes() != null) agenda.setObservacoes(updateDTO.observacoes());
            if (updateDTO.telefone() != null) agenda.setTelefone(updateDTO.telefone());
            if (updateDTO.email() != null) agenda.setEmail(updateDTO.email());
        }

        public void updateStatus(Agenda agenda) {
            if (statusUpdateDTO == null) {
                throw new IllegalStateException("StatusUpdateDTO não disponível");
            }

            if (statusUpdateDTO.status() != null) {
                agenda.setStatus(statusUpdateDTO.status());
            }
        }

        // ========== MÉTODOS PRIVADOS ==========

        private Agenda fromCreateDTO() {
            return Agenda.builder()
                    .pacienteId(createDTO.pacienteId())
                    .pacienteNome(createDTO.pacienteNome())
                    .dentistaId(createDTO.dentistaId())
                    .dentistaNome(createDTO.dentistaNome())
                    .dataHora(createDTO.dataHora())
                    .status(createDTO.status() != null ? createDTO.status() : Agenda.StatusAgendamento.AGENDADO)
                    .observacoes(createDTO.observacoes())
                    .telefone(createDTO.telefone())
                    .email(createDTO.email())
                    .build();
        }

        private void validateEntity() {
            if (agenda == null) {
                throw new IllegalStateException("Entidade Agenda não disponível para conversão");
            }
        }
    }
}