package com.consultorio.domain.paciente;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository repo;

    public PacienteService(PacienteRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public PacienteResponseDTO criar(PacienteRequestDTO dto){
        if(dto.getCpf() != null && repo.existsByCpf(dto.getCpf())){
            throw new IllegalArgumentException("Já existe um paciente cadastrado com este CPF");
        }

        Paciente p = PacienteMapper.toEntity(dto);
        return PacienteMapper.toResponse(repo.save(p));
    }

    public List<PacienteResponseDTO> listar(){
        return repo.findAll().stream().map(PacienteMapper::toResponse).toList();
    }

    public PacienteResponseDTO buscar(Long id){
        Paciente p = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado"));
        return PacienteMapper.toResponse(p);
    }

    @Transactional
    public PacienteResponseDTO atualizar(Long id, PacienteRequestDTO dto){
        Paciente p = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado"));

        if(dto.getCpf() != null && repo.existsByCpfAndIdNot(dto.getCpf(), id)){
            throw new IllegalArgumentException("Já existe um paciente cadastrado com este CPF");
        }
        PacienteMapper.update(dto, p);
        return PacienteMapper.toResponse(repo.save(p));
    }

    @Transactional
    public void deletar(Long id){
        if(!repo.existsById(id)) throw new EntityNotFoundException("Paciente não encontrado");
        repo.deleteById(id);
    }
}
