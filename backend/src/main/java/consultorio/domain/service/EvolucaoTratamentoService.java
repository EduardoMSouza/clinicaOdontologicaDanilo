package consultorio.consultorio.domain.service;

import consultorio.consultorio.api.mapper.EvolucaoTratamentoMapper;
import consultorio.consultorio.api.request.EvolucaoTratamentoRequest;
import consultorio.consultorio.api.response.EvolucaoTratamentoResponse;
import consultorio.consultorio.domain.entity.EvolucaoTratamento;
import consultorio.consultorio.domain.entity.PlanoTratamento;
import consultorio.consultorio.domain.repository.EvolucaoTratamentoRepository;
import consultorio.consultorio.domain.repository.PlanoTratamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvolucaoTratamentoService {

    private final EvolucaoTratamentoRepository repository;
    private final PlanoTratamentoRepository planoTratamentoRepository;
    private final EvolucaoTratamentoMapper mapper;
    private final PacienteService pacienteService;
    private final DentistaService dentistaService;

    @Transactional
    public EvolucaoTratamentoResponse criar(EvolucaoTratamentoRequest request) {
        EvolucaoTratamento evolucao = mapper.toEntity(request);

        // Busca e associa paciente
        evolucao.setPaciente(pacienteService.buscarPorId(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado")));

        // Busca e associa dentista (se informado)
        if (request.getDentistaId() != null) {
            evolucao.setDentista(dentistaService.buscarPorId(request.getDentistaId())
                    .orElseThrow(() -> new RuntimeException("Dentista não encontrado")));
        }

        EvolucaoTratamento salvo = repository.save(evolucao);
        return mapper.toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<EvolucaoTratamentoResponse> listarPorPaciente(Long pacienteId) {
        List<EvolucaoTratamento> evolucoes = repository.findByPacienteId(pacienteId);
        return mapper.toResponseList(evolucoes);
    }

    @Transactional(readOnly = true)
    public List<EvolucaoTratamentoResponse> listarPorPlanoTratamento(Long planoTratamentoId) {
        List<EvolucaoTratamento> evolucoes = repository.findByPlanoTratamentoId(planoTratamentoId);
        return mapper.toResponseList(evolucoes);
    }

    @Transactional(readOnly = true)
    public List<EvolucaoTratamentoResponse> listarTodos() {
        List<EvolucaoTratamento> evolucoes = repository.findAll();
        return mapper.toResponseList(evolucoes);
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Evolução de tratamento não encontrada");
        }
        repository.deleteById(id);
    }
}