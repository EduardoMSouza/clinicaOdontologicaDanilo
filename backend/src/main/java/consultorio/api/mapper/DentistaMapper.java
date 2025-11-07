package consultorio.consultorio.api.mapper;

import consultorio.consultorio.api.request.DentistaRequest;
import consultorio.consultorio.api.response.DentistaResponse;
import consultorio.consultorio.domain.entity.Dentista;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DentistaMapper {

    private final ModelMapper mapper;


    //Converte o JSON recebido da requisição para a entidade do banco
    public Dentista toDentista(DentistaRequest request) {
        return mapper.map(request, Dentista.class);
    }


    //converte a entidade JPA para um DTO de resposta enxuto
    public DentistaResponse toDentistaResponse(Dentista dentista) {
        return mapper.map(dentista, DentistaResponse.class);
    }


    //Converter listas completas (por exemplo, ao listar todos os dentistas)
    public List<DentistaResponse> toDentistaResponseList(List<Dentista> dentistas) {
        return dentistas.stream()
                .map(this::toDentistaResponse)
                .collect(Collectors.toList());
    }
}
