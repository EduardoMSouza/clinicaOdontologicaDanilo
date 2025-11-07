package consultorio.consultorio.api.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProntuarioCompletoResponse {
    private String pacienteNome;
    private String pacienteProntuario;
    private List<PlanoTratamentoResponse> planosTratamento;
    private List<EvolucaoTratamentoResponse> evolucoesTratamento;
    private double valorTotalGeral;
}