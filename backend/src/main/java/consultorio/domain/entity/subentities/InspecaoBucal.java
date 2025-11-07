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
public class InspecaoBucal {
    private String lingua;
    private String mucosa;
    private String palato;
    private String face;
    private String labios;
    private String alteracaoOclusao;
    private String tipoOclusao;
    private String protese;
    private String tipoProtese;
    private String gengivas;
    private String glandulas;
    private String outrasObservacoes;
    private String localData;
}
