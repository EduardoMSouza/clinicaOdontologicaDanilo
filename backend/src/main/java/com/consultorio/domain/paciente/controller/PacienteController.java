package com.consultorio.domain.paciente;

import com.consultorio.domain.paciente.DTOs.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService service;

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> criar(@Valid @RequestBody PacienteCreateDTO createDTO) {
        PacienteResponseDTO response = service.criar(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PacienteListDTO>> listarTodos() {
        List<PacienteListDTO> pacientes = service.listarTodos();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/paginado")
    public ResponseEntity<Page<PacienteListDTO>> listarPaginado(Pageable pageable) {
        Page<PacienteListDTO> pacientes = service.listarPaginado(pageable);
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Long id) {
        PacienteResponseDTO paciente = service.buscarPorId(id);
        return ResponseEntity.ok(paciente);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PacienteListDTO>> buscarPorNome(@RequestParam String nome) {
        List<PacienteListDTO> pacientes = service.buscarPorNome(nome);
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<PacienteResponseDTO> buscarPorCpf(@PathVariable String cpf) {
        PacienteResponseDTO paciente = service.buscarPorCpf(cpf);
        return ResponseEntity.ok(paciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PacienteUpdateDTO updateDTO) {
        PacienteResponseDTO response = service.atualizar(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}