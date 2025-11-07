package consultorio.consultorio.domain.service;

import consultorio.consultorio.api.mapper.PlanoTratamentoMapper;
import consultorio.consultorio.api.request.PlanoTratamentoRequest;
import consultorio.consultorio.api.response.PlanoTratamentoResponse;
import consultorio.consultorio.domain.entity.PlanoTratamento;
import consultorio.consultorio.domain.repository.PlanoTratamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanoTratamentoService {

    private final PlanoTratamentoRepository repository;
    private final PlanoTratamentoMapper mapper;
    private final PacienteService pacienteService;
    private final DentistaService dentistaService;

    @Transactional
    public PlanoTratamentoResponse criar(PlanoTratamentoRequest request) {
        PlanoTratamento plano = mapper.toEntity(request);

        // Busca e associa paciente
        plano.setPaciente(pacienteService.buscarPorId(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado")));

        // Busca e associa dentista (se informado)
        if (request.getDentistaId() != null) {
            plano.setDentista(dentistaService.buscarPorId(request.getDentistaId())
                    .orElseThrow(() -> new RuntimeException("Dentista não encontrado")));
        }

        // Calcula valor total (pode ser ajustado conforme regras de negócio)
        plano.setValorTotal(plano.getValor());

        PlanoTratamento salvo = repository.save(plano);
        return mapper.toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<PlanoTratamentoResponse> listarPorPaciente(Long pacienteId) {
        List<PlanoTratamento> planos = repository.findByPacienteId(pacienteId);
        return mapper.toResponseList(planos);
    }

    @Transactional(readOnly = true)
    public List<PlanoTratamentoResponse> listarTodos() {
        List<PlanoTratamento> planos = repository.findAll();
        return mapper.toResponseList(planos);
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Plano de tratamento não encontrado");
        }
        repository.deleteById(id);
    }
}