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
public class Anamnese {
    private boolean febreReumatica;
    private boolean hepatite;
    private boolean diabetes;
    private boolean hipertensao;
    private boolean hiv;
    private boolean alteracaoCoagulacao;
    private boolean reacoesAlergicas;
    private boolean doencasSistemicas;
    private String tratamentosMedicos;
    private boolean internacaoRecente;
    private String medicacaoAtual;
    private boolean fumante;
    private String quantidadeFumo;
    private boolean bebidas;
    private boolean problemasCardiacos;
    private boolean problemasRenais;
    private boolean problemasGastricos;
    private boolean problemasRespiratorios;
    private boolean problemasAlergicos;
    private boolean problemasArticulares;
    private String queixaPrincipal;
    private boolean sofreDoenca;
    private String qualDoenca;
    private boolean tratamentoMedicoAtual;
    private boolean gravidez;
    private boolean usoMedicacao;
    private String nomeMedico;
    private boolean alergia;
    private String alergiaTipo;
    private boolean cirurgia;
    private String cirurgiaTipo;
    private boolean cicatrizacao;
    private boolean anestesia;
    private boolean hemorragia;
    private String habitos;
    private String antecedentesFamiliares;
}
