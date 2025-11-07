package consultorio.utils;

import consultorio.api.mapper.PacienteMapper;
import consultorio.api.request.PacienteRequestDTO;
import consultorio.api.response.PacienteResponse;
import consultorio.domain.entity.Paciente;
import consultorio.domain.service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/pacientes") // Mudança para plural, padrão REST
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService service;
    private final PacienteMapper mapper;

    /**
     * Cria um novo paciente.
     */
    @PostMapping
    public ResponseEntity<PacienteResponse> salvar(@RequestBody @Valid PacienteRequestDTO request) {
        log.info("Recebida requisição para criar novo paciente: {}", request.getNome());

        // 1. Mapeia DTO para Entidade
        Paciente novoPaciente = mapper.toPaciente(request);

        // 2. Salva no Service
        Paciente salvo = service.salvar(novoPaciente);

        // 3. Mapeia Entidade salva para Response DTO e retorna 201 CREATED
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toPacienteResponse(salvo));
    }

    /**
     * Lista todos os pacientes.
     */
    @GetMapping
    public ResponseEntity<List<PacienteResponse>> listarTodos() {
        log.info("Listando todos os pacientes");
        List<Paciente> pacientes = service.listarTodos();
        List<PacienteResponse> responses = mapper.toPacienteResponseList(pacientes);
        return ResponseEntity.ok(responses);
    }

    /**
     * Busca um paciente específico pelo ID.
     * O Service já trata o caso de não encontrado com exceção.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponse> buscarPorId(@PathVariable Long id) {
        log.info("Buscando paciente com ID: {}", id);
        Paciente paciente = service.buscarPorId(id); // Lança exceção se não encontrar
        return ResponseEntity.ok(mapper.toPacienteResponse(paciente));
    }

    /**
     * Atualiza um paciente existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponse> alterar(
            @PathVariable Long id,
            @RequestBody @Valid PacienteRequestDTO request) {

        log.info("Atualizando paciente ID: {}", id);

        // 1. Busca o paciente existente (Service lança exceção se não encontrar)
        Paciente pacienteExistente = service.buscarPorId(id);

        // 2. Atualiza os dados do paciente existente com o DTO
        mapper.updatePacienteFromDto(pacienteExistente, request);

        // 3. Salva a entidade atualizada
        Paciente atualizado = service.salvar(pacienteExistente);

        // 4. Retorna o DTO de resposta
        return ResponseEntity.ok(mapper.toPacienteResponse(atualizado));
    }

    /**
     * Exclui um paciente pelo ID.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Retorna 204 por padrão
    public void deletar(@PathVariable Long id) {
        log.info("Deletando paciente ID: {}", id);
        service.excluirPaciente(id); // Service já trata o caso de não encontrado com exceção
    }
}
