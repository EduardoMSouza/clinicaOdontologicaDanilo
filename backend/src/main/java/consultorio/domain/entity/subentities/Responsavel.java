package consultorio.domain.entity.subentities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Responsavel {
    private String nome;
    private String rg;
    private String orgao;
    private String estadoCivil;
    private String cpf;
}
