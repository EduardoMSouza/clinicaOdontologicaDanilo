package com.consultorio.domain.dentista;

import com.consultorio.domain.dentista.dto.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DentistaService {

    private final DentistaRepository repo;

    public DentistaService(DentistaRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public DentistaResponseDTO criar(DentistaRequestDTO dto){
        Dentista d = DentistaMapper.toEntity(dto);
        return DentistaMapper.toDTO(repo.save(d));
    }

    public List<DentistaResponseDTO> listar(){
        return repo.findAll().stream().map(DentistaMapper::toDTO).toList();
    }

    public DentistaResponseDTO buscar(Long id){
        Dentista d = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dentista não encontrado"));
        return DentistaMapper.toDTO(d);
    }

    @Transactional
    public DentistaResponseDTO atualizar(Long id, DentistaRequestDTO dto){
        Dentista d = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dentista não encontrado"));
        DentistaMapper.update(dto, d);
        return DentistaMapper.toDTO(repo.save(d));
    }

    @Transactional
    public void deletar(Long id){
        if(!repo.existsById(id)) throw new EntityNotFoundException("Dentista não encontrado");
        repo.deleteById(id);
    }
}
