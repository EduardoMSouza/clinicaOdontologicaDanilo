package consultorio.consultorio.api.controller;

import consultorio.consultorio.api.mapper.AgendaMapper;
import consultorio.consultorio.api.request.AgendaRequest;
import consultorio.consultorio.api.response.AgendaResponse;
import consultorio.consultorio.domain.entity.Agenda;
import consultorio.consultorio.domain.service.AgendaService;
import consultorio.consultorio.utils.Calendario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService service;
    private final AgendaMapper mapper;

    @PostMapping
    public ResponseEntity<AgendaResponse> criar(@Valid @RequestBody AgendaRequest request) {
        Agenda agenda = mapper.toAgenda(request);
        Agenda salvo = service.salvar(agenda);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toAgendaResponse(salvo));
    }

    @GetMapping
    public ResponseEntity<List<AgendaResponse>> listar() {
        List<AgendaResponse> lista = mapper.toAgendaResponseList(service.listarTodos());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/dentista/{id}")
    public ResponseEntity<List<AgendaResponse>> listarPorDentista(@PathVariable Long id) {
        List<AgendaResponse> lista = mapper.toAgendaResponseList(service.listarPorDentista(id));
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendaResponse> buscarPorId(@PathVariable Long id) {
        Agenda agenda = service.buscarPorIdOuFalhar(id);
        return ResponseEntity.ok(mapper.toAgendaResponse(agenda));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // NOVOS ENDPOINTS ÚTEIS:

    @GetMapping("/tempos-consulta")
    public ResponseEntity<List<Calendario.TempoConsulta>> getTemposConsulta() {
        return ResponseEntity.ok(Calendario.getTemposConsultaDisponiveis());
    }

    @GetMapping("/disponibilidade")
    public ResponseEntity<Boolean> verificarDisponibilidade(
            @RequestParam Long dentistaId,
            @RequestParam LocalDateTime horario,
            @RequestParam Integer tempoConsultaMinutos) {

        boolean disponivel = service.verificarDisponibilidade(dentistaId, horario, tempoConsultaMinutos);
        return ResponseEntity.ok(disponivel);
    }
}