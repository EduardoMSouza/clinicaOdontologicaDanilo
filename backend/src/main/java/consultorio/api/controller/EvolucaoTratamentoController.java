package consultorio.consultorio.api.controller;

import consultorio.consultorio.api.request.EvolucaoTratamentoRequest;
import consultorio.consultorio.api.response.EvolucaoTratamentoResponse;
import consultorio.consultorio.domain.service.EvolucaoTratamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evolucoes-tratamento")
@RequiredArgsConstructor
public class EvolucaoTratamentoController {

    private final EvolucaoTratamentoService service;

    @PostMapping
    public ResponseEntity<EvolucaoTratamentoResponse> criar(@RequestBody EvolucaoTratamentoRequest request) {
        EvolucaoTratamentoResponse response = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EvolucaoTratamentoResponse>> listarTodos() {
        List<EvolucaoTratamentoResponse> response = service.listarTodos();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<EvolucaoTratamentoResponse>> listarPorPaciente(@PathVariable Long pacienteId) {
        List<EvolucaoTratamentoResponse> response = service.listarPorPaciente(pacienteId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/plano-tratamento/{planoTratamentoId}")
    public ResponseEntity<List<EvolucaoTratamentoResponse>> listarPorPlanoTratamento(@PathVariable Long planoTratamentoId) {
        List<EvolucaoTratamentoResponse> response = service.listarPorPlanoTratamento(planoTratamentoId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}