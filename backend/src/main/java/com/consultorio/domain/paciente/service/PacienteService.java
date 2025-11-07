package com.consultorio.domain.paciente;

import com.consultorio.domain.paciente.DTOs.*;
import com.consultorio.domain.paciente.erro.PacienteDuplicadoException;
import com.consultorio.domain.paciente.erro.PacienteNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository repository;
    private final PacienteConverter converter;

    // ========== OPERAÇÕES CRUD ==========

    @Transactional
    public PacienteResponseDTO criar(PacienteCreateDTO createDTO) {
        log.info("Criando paciente: {}", createDTO.nome());

        validarUnicidadeCriacao(createDTO);
        Paciente paciente = salvarPaciente(createDTO);

        log.info("Paciente criado com ID: {}", paciente.getId());
        return toResponse(paciente);
    }

    @Transactional(readOnly = true)
    public PacienteResponseDTO buscarPorId(Long id) {
        log.info("Buscando paciente por ID: {}", id);

        Paciente paciente = buscarPacientePorId(id);
        return toResponse(paciente);
    }

    @Transactional
    public PacienteResponseDTO atualizar(Long id, PacienteUpdateDTO updateDTO) {
        log.info("Atualizando paciente ID: {}", id);

        validarUnicidadeAtualizacao(id, updateDTO);
        Paciente paciente = atualizarPaciente(id, updateDTO);

        log.info("Paciente ID: {} atualizado com sucesso", id);
        return toResponse(paciente);
    }

    @Transactional
    public void excluir(Long id) {
        log.info("Excluindo paciente ID: {}", id);

        validarExistencia(id);
        repository.deleteById(id);

        log.info("Paciente ID: {} excluído com sucesso", id);
    }

    // ========== CONSULTAS ==========

    @Transactional(readOnly = true)
    public List<PacienteListDTO> listarTodos() {
        log.info("Listando todos os pacientes");

        List<Paciente> pacientes = repository.findAllByOrderByDataCadastroDesc();
        return toListDTOs(pacientes);
    }

    @Transactional(readOnly = true)
    public Page<PacienteListDTO> listarPaginado(Pageable pageable) {
        log.info("Listando pacientes paginados - página: {}, tamanho: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return repository.findAllByOrderByDataCadastroDesc(pageable)
                .map(this::toListDTO);
    }

    @Transactional(readOnly = true)
    public List<PacienteListDTO> buscarPorNome(String nome) {
        log.info("Buscando pacientes por nome: {}", nome);

        if (nome == null || nome.trim().isEmpty()) {
            return listarTodos();
        }

        List<Paciente> pacientes = repository.findByNomeContainingIgnoreCaseOrderByNome(nome);
        return toListDTOs(pacientes);
    }

    @Transactional(readOnly = true)
    public PacienteResponseDTO buscarPorCpf(String cpf) {
        log.info("Buscando paciente por CPF: {}", cpf);

        Paciente paciente = repository.findByCpf(cpf)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com CPF: " + cpf));

        return toResponse(paciente);
    }

    // ========== MÉTODOS PRIVADOS - LÓGICA INTERNA ==========

    private Paciente salvarPaciente(PacienteCreateDTO createDTO) {
        Paciente entity = converter.fromCreate(createDTO).toEntity();
        return repository.save(entity);
    }

    private Paciente atualizarPaciente(Long id, PacienteUpdateDTO updateDTO) {
        Paciente existente = buscarPacientePorId(id);
        converter.fromUpdate(updateDTO).updateEntity(existente);
        return repository.save(existente);
    }

    private Paciente buscarPacientePorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new PacienteNotFoundException("Paciente não encontrado com ID: " + id));
    }

    private void validarExistencia(Long id) {
        if (!repository.existsById(id)) {
            throw new PacienteNotFoundException("Paciente não encontrado com ID: " + id);
        }
    }

    private void validarUnicidadeCriacao(PacienteCreateDTO createDTO) {
        validarCpfUnico(createDTO.cpf(), null);
        validarProntuarioUnico(createDTO.prontuario(), null);
    }

    private void validarUnicidadeAtualizacao(Long id, PacienteUpdateDTO updateDTO) {
        validarCpfUnico(updateDTO.cpf(), id);
    }

    private void validarCpfUnico(String cpf, Long idExcluir) {
        if (cpf != null && !cpf.trim().isEmpty()) {
            boolean cpfExiste = (idExcluir == null)
                    ? repository.existsByCpf(cpf)
                    : repository.existsByCpfAndIdNot(cpf, idExcluir);

            if (cpfExiste) {
                throw new PacienteDuplicadoException("Já existe um paciente com este CPF: " + cpf);
            }
        }
    }

    private void validarProntuarioUnico(String prontuario, Long idExcluir) {
        if (prontuario != null && !prontuario.trim().isEmpty()) {
            boolean prontuarioExiste = (idExcluir == null)
                    ? repository.existsByProntuario(prontuario)
                    : repository.existsByProntuarioAndIdNot(prontuario, idExcluir);

            if (prontuarioExiste) {
                throw new PacienteDuplicadoException("Já existe um paciente com este prontuário: " + prontuario);
            }
        }
    }

    // ========== MÉTODOS DE CONVERSÃO ==========

    private PacienteResponseDTO toResponse(Paciente paciente) {
        return converter.fromEntity(paciente).toResponse();
    }

    private PacienteListDTO toListDTO(Paciente paciente) {
        return converter.fromEntity(paciente).toList();
    }

    private List<PacienteListDTO> toListDTOs(List<Paciente> pacientes) {
        return pacientes.stream()
                .map(this::toListDTO)
                .toList();
    }
}