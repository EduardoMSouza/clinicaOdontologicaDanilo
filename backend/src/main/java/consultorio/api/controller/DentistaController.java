package consultorio.consultorio.api.controller;

import consultorio.consultorio.api.mapper.DentistaMapper;
import consultorio.consultorio.api.request.DentistaRequest;
import consultorio.consultorio.api.response.DentistaResponse;
import consultorio.consultorio.domain.entity.Dentista;
import consultorio.consultorio.domain.service.DentistaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/dentista")
@RequiredArgsConstructor
public class DentistaController {

    private final DentistaService service;
    private final DentistaMapper mapper;

    /**
     * Cria um novo dentista (automaticamente cria uma agenda para ele)
     */
    @PostMapping
    public ResponseEntity<DentistaResponse> salvar(@RequestBody DentistaRequest request) {

        //converte o toDentista da requisição e salva na variavel dentista da entidade Dentista
        Dentista dentista = mapper.toDentista(request);

        //variavel recebe a função do service para criar a entidade
        Dentista salvo = service.salvar(dentista);

        //resposta para avisar do status http criado e o corpo salvo do toDentistaResponse
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDentistaResponse(salvo));
    }

    /**
     * Lista todos os dentistas
     */
    @GetMapping
    public ResponseEntity<List<DentistaResponse>> listarTodos() {
        List<DentistaResponse> responses = mapper.toDentistaResponseList(service.listarTodos());
        return ResponseEntity.ok(responses);
    }

    /**
     * Busca um dentista específico pelo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DentistaResponse> buscarPorId(@PathVariable Long id) {
        Optional<Dentista> optDentista = service.buscarPorId(id);

        if (optDentista.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapper.toDentistaResponse(optDentista.get()));
    }

    /**
     * Agenda um horário para o dentista
     */
    @PostMapping("/{dentistaId}/agendar")
    public ResponseEntity<Void> agendarHorario(
            @PathVariable Long dentistaId,
            @RequestParam LocalDateTime horario,
            @RequestParam String descricao) {

        service.agendarHorario(dentistaId, horario, descricao, null);
        return ResponseEntity.ok().build();
    }

    /**
     * Exclui um dentista pelo ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Optional<Dentista> dentistaExistente = service.buscarPorId(id);

        if (dentistaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.excluirDentista(id);
        return ResponseEntity.noContent().build();
    }
}