package consultorio.consultorio.api.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanoTratamentoResponse {
    private Long id;
    private String dente;
    private String procedimento;
    private Double valor;
    private String observacao;
    private double valorTotal;
    private String pacienteNome;
    private String dentistaNome;
}
