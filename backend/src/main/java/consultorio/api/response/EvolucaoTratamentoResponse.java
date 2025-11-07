package consultorio.consultorio.api.response;

import lombok.Getter;
import lombok.Setter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvolucaoTratamentoResponse {
    private Long id;
    private String dataProcedimento;
    private String evolucaoIntercorrenciasTratamento;
    private String pacienteNome;
    private String dentistaNome;
    private String planoTratamentoDescricao;
}
