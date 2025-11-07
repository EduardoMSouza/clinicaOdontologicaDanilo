package consultorio.consultorio.api.mapper;

import consultorio.consultorio.api.request.EvolucaoTratamentoRequest;
import consultorio.consultorio.api.response.EvolucaoTratamentoResponse;
import consultorio.consultorio.domain.entity.EvolucaoTratamento;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EvolucaoTratamentoMapper {

    private final ModelMapper mapper;

    public EvolucaoTratamento toEntity(EvolucaoTratamentoRequest request) {
        return mapper.map(request, EvolucaoTratamento.class);
    }

    public EvolucaoTratamentoResponse toResponse(EvolucaoTratamento evolucao) {
        EvolucaoTratamentoResponse response = mapper.map(evolucao, EvolucaoTratamentoResponse.class);

        if (evolucao.getPaciente() != null) {
            response.setPacienteNome(evolucao.getPaciente().getNome());
        }

        if (evolucao.getDentista() != null) {
            response.setDentistaNome(evolucao.getDentista().getNome());
        }

        return response;
    }

    public List<EvolucaoTratamentoResponse> toResponseList(List<EvolucaoTratamento> evolucoes) {
        return evolucoes.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}