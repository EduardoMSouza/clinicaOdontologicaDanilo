package com.consultorio.domain.paciente;

import com.consultorio.domain.paciente.DTOs.*;
import org.springframework.stereotype.Component;

@Component
public class PacienteConverter {

    // ========== ENTRADAS ==========

    public PacienteConvert fromEntity(Paciente paciente) {
        return new PacienteConvert(paciente);
    }

    public PacienteConvert fromCreate(PacienteCreateDTO dto) {
        return new PacienteConvert(dto);
    }

    public PacienteConvert fromUpdate(PacienteUpdateDTO dto) {
        return new PacienteConvert(dto);
    }

    // ========== CLASSE DE CONVERSÃO ==========

    public static class PacienteConvert {
        private Paciente paciente;
        private PacienteCreateDTO createDTO;
        private PacienteUpdateDTO updateDTO;

        // Constructor para Entity → DTO
        public PacienteConvert(Paciente paciente) {
            this.paciente = paciente;
        }

        // Constructor para CreateDTO → Entity
        public PacienteConvert(PacienteCreateDTO createDTO) {
            this.createDTO = createDTO;
        }

        // Constructor para UpdateDTO → Entity
        public PacienteConvert(PacienteUpdateDTO updateDTO) {
            this.updateDTO = updateDTO;
        }

        // ========== CONVERSÕES PARA DTO ==========

        public PacienteResponseDTO toResponse() {
            validateEntity();

            return PacienteResponseDTO.builder()
                    .id(paciente.getId())
                    .nome(paciente.getNome())
                    .prontuario(paciente.getProntuario())
                    .cpf(paciente.getCpf())
                    .rg(paciente.getRg())
                    .email(paciente.getEmail())
                    .telefone(paciente.getTelefone())
                    .dataNascimento(paciente.getDataNascimento())
                    .sexo(paciente.getSexo())
                    .convenio(paciente.getConvenio())
                    .enderecoResidencial(paciente.getEnderecoResidencial())
                    .naturalidade(paciente.getNaturalidade())
                    .nacionalidade(paciente.getNacionalidade())
                    .profissao(paciente.getProfissao())
                    .estadoCivil(paciente.getEstadoCivil())
                    .indicadoPor(paciente.getIndicadoPor())
                    .responsavelNome(paciente.getResponsavelNome())
                    .responsavelTelefone(paciente.getResponsavelTelefone())
                    .dataCadastro(paciente.getDataCadastro())
                    .dataAtualizacao(paciente.getDataAtualizacao())
                    .build();
        }

        public PacienteListDTO toList() {
            validateEntity();

            return PacienteListDTO.builder()
                    .id(paciente.getId())
                    .nome(paciente.getNome())
                    .cpf(paciente.getCpf())
                    .telefone(paciente.getTelefone())
                    .email(paciente.getEmail())
                    .convenio(paciente.getConvenio())
                    .dataNascimento(paciente.getDataNascimento())
                    .dataCadastro(paciente.getDataCadastro())
                    .build();
        }

        // ========== CONVERSÕES PARA ENTITY ==========

        public Paciente toEntity() {
            if (createDTO != null) {
                return fromCreateDTO();
            }
            throw new IllegalStateException("Nenhum DTO disponível para conversão");
        }

        public void updateEntity(Paciente paciente) {
            if (updateDTO == null) {
                throw new IllegalStateException("UpdateDTO não disponível");
            }

            if (updateDTO.nome() != null) paciente.setNome(updateDTO.nome());
            if (updateDTO.telefone() != null) paciente.setTelefone(updateDTO.telefone());
            if (updateDTO.email() != null) paciente.setEmail(updateDTO.email());
            if (updateDTO.dataNascimento() != null) paciente.setDataNascimento(updateDTO.dataNascimento());
            if (updateDTO.sexo() != null) paciente.setSexo(updateDTO.sexo());
            if (updateDTO.convenio() != null) paciente.setConvenio(updateDTO.convenio());
            if (updateDTO.enderecoResidencial() != null) paciente.setEnderecoResidencial(updateDTO.enderecoResidencial());
            if (updateDTO.profissao() != null) paciente.setProfissao(updateDTO.profissao());
            if (updateDTO.estadoCivil() != null) paciente.setEstadoCivil(updateDTO.estadoCivil());
        }

        // ========== MÉTODOS PRIVADOS ==========

        private Paciente fromCreateDTO() {
            return Paciente.builder()
                    .nome(createDTO.nome())
                    .prontuario(createDTO.prontuario())
                    .cpf(createDTO.cpf())
                    .rg(createDTO.rg())
                    .email(createDTO.email())
                    .telefone(createDTO.telefone())
                    .dataNascimento(createDTO.dataNascimento())
                    .sexo(createDTO.sexo())
                    .convenio(createDTO.convenio())
                    .enderecoResidencial(createDTO.enderecoResidencial())
                    .naturalidade(createDTO.naturalidade())
                    .nacionalidade(createDTO.nacionalidade())
                    .profissao(createDTO.profissao())
                    .estadoCivil(createDTO.estadoCivil())
                    .indicadoPor(createDTO.indicadoPor())
                    .responsavelNome(createDTO.responsavelNome())
                    .responsavelTelefone(createDTO.responsavelTelefone())
                    .build();
        }

        private void validateEntity() {
            if (paciente == null) {
                throw new IllegalStateException("Entidade Paciente não disponível para conversão");
            }
        }
    }
}