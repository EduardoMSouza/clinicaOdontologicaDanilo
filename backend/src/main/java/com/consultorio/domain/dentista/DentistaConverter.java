// DentistaConverter.java
package com.consultorio.domain.dentista.dto;

import com.consultorio.domain.dentista.Dentista;
import com.consultorio.domain.dentista.dto.*;
import org.springframework.stereotype.Component;

@Component
public class DentistaConverter {

    // ========== ENTRADAS ==========

    public DentistaConvert fromEntity(Dentista dentista) {
        return new DentistaConvert(dentista);
    }

    public DentistaConvert fromCreate(DentistaCreateDTO dto) {
        return new DentistaConvert(dto);
    }

    public DentistaConvert fromUpdate(DentistaUpdateDTO dto) {
        return new DentistaConvert(dto);
    }

    // ========== CLASSE DE CONVERSÃO ==========

    public static class DentistaConvert {
        private Dentista dentista;
        private DentistaCreateDTO createDTO;
        private DentistaUpdateDTO updateDTO;

        // Constructor para Entity → DTO
        public DentistaConvert(Dentista dentista) {
            this.dentista = dentista;
        }

        // Constructor para CreateDTO → Entity
        public DentistaConvert(DentistaCreateDTO createDTO) {
            this.createDTO = createDTO;
        }

        // Constructor para UpdateDTO → Entity
        public DentistaConvert(DentistaUpdateDTO updateDTO) {
            this.updateDTO = updateDTO;
        }

        // ========== CONVERSÕES PARA DTO ==========

        public DentistaResponseDTO toResponse() {
            validateEntity();

            return DentistaResponseDTO.builder()
                    .id(dentista.getId())
                    .nome(dentista.getNome())
                    .cro(dentista.getCro())
                    .especialidade(dentista.getEspecialidade())
                    .telefone(dentista.getTelefone())
                    .email(dentista.getEmail())
                    .ativo(dentista.getAtivo())
                    .build();
        }

        public DentistaListDTO toList() {
            validateEntity();

            return DentistaListDTO.builder()
                    .id(dentista.getId())
                    .nome(dentista.getNome())
                    .cro(dentista.getCro())
                    .especialidade(dentista.getEspecialidade())
                    .telefone(dentista.getTelefone())
                    .email(dentista.getEmail())
                    .ativo(dentista.getAtivo())
                    .build();
        }

        // ========== CONVERSÕES PARA ENTITY ==========

        public Dentista toEntity() {
            if (createDTO != null) {
                return fromCreateDTO();
            }
            throw new IllegalStateException("Nenhum DTO disponível para conversão");
        }

        public void updateEntity(Dentista dentista) {
            if (updateDTO == null) {
                throw new IllegalStateException("UpdateDTO não disponível");
            }

            if (updateDTO.nome() != null) dentista.setNome(updateDTO.nome());
            if (updateDTO.cro() != null) dentista.setCro(updateDTO.cro());
            if (updateDTO.especialidade() != null) dentista.setEspecialidade(updateDTO.especialidade());
            if (updateDTO.telefone() != null) dentista.setTelefone(updateDTO.telefone());
            if (updateDTO.email() != null) dentista.setEmail(updateDTO.email());
            if (updateDTO.ativo() != null) dentista.setAtivo(updateDTO.ativo());
        }

        // ========== MÉTODOS PRIVADOS ==========

        private Dentista fromCreateDTO() {
            return Dentista.builder()
                    .nome(createDTO.nome())
                    .cro(createDTO.cro())
                    .especialidade(createDTO.especialidade())
                    .telefone(createDTO.telefone())
                    .email(createDTO.email())
                    .ativo(createDTO.ativo() != null ? createDTO.ativo() : true)
                    .build();
        }

        private void validateEntity() {
            if (dentista == null) {
                throw new IllegalStateException("Entidade Dentista não disponível para conversão");
            }
        }
    }
}