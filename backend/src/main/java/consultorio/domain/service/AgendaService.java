package consultorio.consultorio.domain.service;

import consultorio.consultorio.domain.entity.Agenda;
import consultorio.consultorio.domain.exception.BusinessException;
import consultorio.consultorio.domain.repository.AgendaRepository;
import consultorio.consultorio.utils.Calendario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AgendaService {

    private final AgendaRepository repository;

    public Agenda salvar(Agenda agenda) {
        log.info("Salvando agendamento para dentista ID: {}", agenda.getDentista().getId());

        // Validação das regras de negócio do Calendario
        Calendario.validarAgendamento(agenda);

        // Valida conflito de horário considerando a duração da consulta
        LocalDateTime horarioFim = agenda.getHorarioFim();
        boolean conflito = !repository.findByDentistaIdAndHorarioBetween(
                agenda.getDentista().getId(),
                agenda.getHorario(),
                horarioFim.minusSeconds(1) // Evita conflito no exato momento do fim
        ).isEmpty();

        if (conflito) {
            throw new BusinessException("Já existe um agendamento neste horário para o dentista selecionado.");
        }

        // Define valores padrão
        if (agenda.getDataCriacao() == null) {
            agenda.setDataCriacao(LocalDateTime.now());
        }
        if (agenda.getStatus() == null) {
            agenda.setStatus("AGENDADO");
        }

        return repository.save(agenda);
    }

    public List<Agenda> listarTodos() {
        return repository.findAll();
    }

    public List<Agenda> listarPorDentista(Long dentistaId) {
        return repository.findByDentistaId(dentistaId);
    }

    public Agenda buscarPorIdOuFalhar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException("Agendamento não encontrado com ID: " + id));
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new BusinessException("Agendamento não encontrado com ID: " + id);
        }
        repository.deleteById(id);
    }

    // Método adicional para verificar disponibilidade
    public boolean verificarDisponibilidade(Long dentistaId, LocalDateTime horario, Integer tempoConsultaMinutos) {
        LocalDateTime horarioFim = horario.plusMinutes(tempoConsultaMinutos);
        return repository.findByDentistaIdAndHorarioBetween(
                dentistaId, horario, horarioFim.minusSeconds(1)
        ).isEmpty();
    }
}