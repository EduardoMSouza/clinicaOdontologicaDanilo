package consultorio.consultorio.api.mapper;

import consultorio.consultorio.api.request.PlanoTratamentoRequest;
import consultorio.consultorio.api.response.PlanoTratamentoResponse;
import consultorio.consultorio.domain.entity.PlanoTratamento;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PlanoTratamentoMapper {

    private final ModelMapper mapper;

    public PlanoTratamento toEntity(PlanoTratamentoRequest request) {
        return mapper.map(request, PlanoTratamento.class);
    }

    public PlanoTratamentoResponse toResponse(PlanoTratamento plano) {
        PlanoTratamentoResponse response = mapper.map(plano, PlanoTratamentoResponse.class);

        if (plano.getPaciente() != null) {
            response.setPacienteNome(plano.getPaciente().getNome());
        }

        if (plano.getDentista() != null) {
            response.setDentistaNome(plano.getDentista().getNome());
        }

        return response;
    }

    public List<PlanoTratamentoResponse> toResponseList(List<PlanoTratamento> planos) {
        return planos.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
