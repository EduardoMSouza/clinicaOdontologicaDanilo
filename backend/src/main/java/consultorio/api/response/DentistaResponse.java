package consultorio.consultorio.api.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DentistaResponse {
    private Long id;
    private String nome;
    private String cro;
    private String especialidade;
    private String telefone;
    private String email;
    private Boolean ativo;
}
