package consultorio.utils;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PacienteResponse {

    private Long id;
    private String prontuario;

    // Dados Pessoais
    private String nome;
    private String email;
    private String rg;
    private String orgaoExpedidor;
    private String dataNascimento; // String formatada
    private String naturalidade;
    private String nacionalidade;
    private String estadoCivil;
    private String profissao;
    private String enderecoResidencial;
    private String cpf;
    private String sexo;
    private String telefone;
    private String indicadoPor;
    private String convenio;
    private String numeroInscricaoConvenio;

    // Responsável
    private String responsavelNome;
    private String responsavelRg;
    private String responsavelOrgao;
    private String responsavelEstadoCivil;
    private String responsavelCpf;

    // Cônjuge
    private String conjugeNome;
    private String conjugeRg;
    private String conjugeCpf;

    // Anamnese
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

    // Inspeção Bucal
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

    private String dataCadastro; // String formatada
}
