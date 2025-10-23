package com.consultorio.domain.agenda;

import com.consultorio.domain.agenda.dto.*;
import com.consultorio.domain.dentista.Dentista;
import com.consultorio.domain.dentista.DentistaRepository;
import com.consultorio.domain.paciente.Paciente;
import com.consultorio.domain.paciente.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AgendaService {

    private final AgendaRepository repo;
    private final PacienteRepository pacienteRepo;
    private final DentistaRepository dentistaRepo;

    public AgendaService(AgendaRepository repo, PacienteRepository pacienteRepo, DentistaRepository dentistaRepo) {
        this.repo = repo;
        this.pacienteRepo = pacienteRepo;
        this.dentistaRepo = dentistaRepo;
    }

    @Transactional
    public AgendaResponseDTO agendar(AgendaRequestDTO dto){
        Paciente p = pacienteRepo.findById(dto.getPacienteId())
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado"));
        Dentista d = dentistaRepo.findById(dto.getDentistaId())
                .orElseThrow(() -> new EntityNotFoundException("Dentista não encontrado"));

        LocalDateTime dataHora = dto.getDataHora();
        if(dataHora == null){
            throw new IllegalArgumentException("A data e hora do agendamento são obrigatórias");
        }

        List<Agenda> conflitos = repo.findByDentistaIdAndDataHoraBetween(
                dto.getDentistaId(),
                dataHora.minusMinutes(59),
                dataHora.plusMinutes(59)
        );

        boolean existeConflitoMesmoHorario = conflitos.stream()
                .anyMatch(a -> a.getDataHora().equals(dataHora));

        if(existeConflitoMesmoHorario){
            throw new IllegalArgumentException("Já existe um agendamento para este dentista neste horário");
        }

        Agenda a = new Agenda();
        a.setPaciente(p);
        a.setDentista(d);
        a.setDataHora(dataHora);
        a.setObservacoes(dto.getObservacoes());
        a.setStatus(StatusAgendamento.AGENDADO);

        return AgendaMapper.toResponse(repo.save(a));
    }

    public List<AgendaResponseDTO> listar(){
        return repo.findAll(Sort.by(Sort.Direction.ASC, "dataHora"))
                .stream()
                .map(AgendaMapper::toResponse)
                .toList();
    }

    public AgendaResponseDTO buscar(Long id){
        Agenda a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));
        return AgendaMapper.toResponse(a);
    }

    @Transactional
    public AgendaResponseDTO atualizarStatus(Long id, String status){
        Agenda a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));
        try {
            a.setStatus(StatusAgendamento.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException ex){
            throw new IllegalArgumentException("Status inválido: " + status);
        }
        return AgendaMapper.toResponse(repo.save(a));
    }

    @Transactional
    public void cancelar(Long id){
        Agenda a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado"));
        a.setStatus(StatusAgendamento.CANCELADO);
        repo.save(a);
    }

    @Transactional
    public void deletar(Long id){
        if(!repo.existsById(id)) throw new EntityNotFoundException("Agendamento não encontrado");
        repo.deleteById(id);
    }
}
