package consultorio.consultorio.api.controller;

import consultorio.consultorio.api.request.PlanoTratamentoRequest;
import consultorio.consultorio.api.response.PlanoTratamentoResponse;
import consultorio.consultorio.domain.service.PlanoTratamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/planos-tratamento")
@RequiredArgsConstructor
public class PlanoTratamentoController {

    private final PlanoTratamentoService service;

    @PostMapping
    public ResponseEntity<PlanoTratamentoResponse> criar(@RequestBody PlanoTratamentoRequest request) {
        PlanoTratamentoResponse response = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PlanoTratamentoResponse>> listarTodos() {
        List<PlanoTratamentoResponse> response = service.listarTodos();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<PlanoTratamentoResponse>> listarPorPaciente(@PathVariable Long pacienteId) {
        List<PlanoTratamentoResponse> response = service.listarPorPaciente(pacienteId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}