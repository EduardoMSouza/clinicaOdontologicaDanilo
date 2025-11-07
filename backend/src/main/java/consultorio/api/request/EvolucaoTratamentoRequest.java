package consultorio.consultorio.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvolucaoTratamentoRequest {
    private String dataProcedimento;
    private String evolucaoIntercorrenciasTratamento;
    private Long pacienteId;
    private Long dentistaId;
    private Long planoTratamentoId;
}
