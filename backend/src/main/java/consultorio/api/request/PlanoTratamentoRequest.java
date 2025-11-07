package consultorio.consultorio.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanoTratamentoRequest {
    private String dente;
    private String procedimento;
    private Double valor;
    private String observacao;
    private Long pacienteId;
    private Long dentistaId;
}
