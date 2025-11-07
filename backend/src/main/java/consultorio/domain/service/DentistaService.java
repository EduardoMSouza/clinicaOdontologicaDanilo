package consultorio.consultorio.domain.service;

import consultorio.consultorio.domain.entity.Agenda;
import consultorio.consultorio.domain.entity.Dentista;
import consultorio.consultorio.domain.repository.DentistaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DentistaService {

    private final DentistaRepository dentistaRepository;

    @Transactional
    public Dentista salvar(Dentista dentista) {
        log.info("Salvando dentista: {}", dentista.getNome());
        Dentista dentistaSalvo = dentistaRepository.save(dentista);
        log.info("Dentista salvo com ID: {} e agenda criada automaticamente", dentistaSalvo.getId());
        return dentistaSalvo;
    }

    @Transactional(readOnly = true)
    public List<Dentista> listarTodos() {
        return dentistaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Dentista> buscarPorId(Long id) {
        return dentistaRepository.findById(id);
    }

    @Transactional
    public void excluirDentista(Long id) {
        Dentista dentista = dentistaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dentista não encontrado com ID: " + id));

        dentistaRepository.delete(dentista);
        log.info("Dentista ID {} excluído com sucesso junto com todas as agendas", id);
    }

    // Método para agendar horário na agenda do dentista
    @Transactional
    public void agendarHorario(Long dentistaId, LocalDateTime horario, String descricao, Long pacienteId) {
        Dentista dentista = dentistaRepository.findById(dentistaId)
                .orElseThrow(() -> new RuntimeException("Dentista não encontrado"));

        // Verifica se já existe agendamento nesse horário
        boolean horarioOcupado = dentista.getAgendas().stream()
                .anyMatch(agenda -> agenda.getHorario().equals(horario));

        if (horarioOcupado) {
            throw new RuntimeException("Horário já ocupado para este dentista");
        }

        // Cria novo agendamento
        Agenda novoAgendamento = Agenda.builder()
                .descricao(descricao)
                .horario(horario)
                .dentista(dentista)
                .status("AGENDADO")
                .observacoes("Agendamento realizado via sistema")
                .build();

        dentista.adicionarAgenda(novoAgendamento);
        dentistaRepository.save(dentista);
    }
}