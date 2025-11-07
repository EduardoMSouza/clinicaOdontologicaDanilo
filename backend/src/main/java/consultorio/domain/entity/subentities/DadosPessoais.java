package consultorio.domain.entity.subentities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DadosPessoais {

    @Column(nullable = false)
    private String nome;

    private String email;

    @Column(unique = true)
    private String rg;

    private String orgaoExpedidor;

    @Column(nullable = false)
    private String dataNascimento;

    private String naturalidade;
    private String nacionalidade;
    private String estadoCivil;
    private String profissao;
    private String enderecoResidencial;

    @Column(unique = true)
    private String cpf;

    private String sexo;
    private String telefone;
    private String indicadoPor;
    private String convenio;
    private String numeroInscricaoConvenio;
}
