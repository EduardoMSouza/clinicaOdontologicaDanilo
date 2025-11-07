package consultorio.utils;

import consultorio.api.request.PacienteRequestDTO;
import consultorio.api.response.PacienteResponse;
import consultorio.domain.entity.Paciente;
import consultorio.domain.entity.subentities.*; // Importar as subentidades
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PacienteMapper {

    // Usando ModelMapper ou MapStruct seria o ideal, mas para refatoração manual,
    // faremos o mapeamento explícito para garantir a correta separação das subentidades.

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    /**
     * Converte PacienteRequestDTO para Paciente (Entidade).
     *
     * @param request DTO de requisição.
     * @return Entidade Paciente.
     */
    public Paciente toPaciente(PacienteRequestDTO request) {
        // O ID e o Prontuário são definidos no Controller (para atualização) ou no Service (para criação)
        return Paciente.builder()
                .dadosPessoais(mapToDadosPessoais(request))
                .responsavel(mapToResponsavel(request))
                .conjuge(mapToConjuge(request))
                .anamnese(mapToAnamnese(request))
                .inspecaoBucal(mapToInspecaoBucal(request))
                // dataCadastro é preenchida no @PrePersist da Entidade
                .build();
    }

    /**
     * Converte Paciente (Entidade) para PacienteResponse (DTO).
     *
     * @param paciente Entidade Paciente.
     * @return DTO de resposta.
     */
    public PacienteResponse toPacienteResponse(Paciente paciente) {
        return PacienteResponse.builder()
                .id(paciente.getId())
                .prontuario(paciente.getProntuario())
                // Dados Pessoais
                .nome(paciente.getDadosPessoais().getNome())
                .email(paciente.getDadosPessoais().getEmail())
                .rg(paciente.getDadosPessoais().getRg())
                .orgaoExpedidor(paciente.getDadosPessoais().getOrgaoExpedidor())
                .dataNascimento(formatDate(paciente.getDadosPessoais().getDataNascimento()))
                .naturalidade(paciente.getDadosPessoais().getNaturalidade())
                .nacionalidade(paciente.getDadosPessoais().getNacionalidade())
                .estadoCivil(paciente.getDadosPessoais().getEstadoCivil())
                .profissao(paciente.getDadosPessoais().getProfissao())
                .enderecoResidencial(paciente.getDadosPessoais().getEnderecoResidencial())
                .cpf(paciente.getDadosPessoais().getCpf())
                .sexo(paciente.getDadosPessoais().getSexo())
                .telefone(paciente.getDadosPessoais().getTelefone())
                .indicadoPor(paciente.getDadosPessoais().getIndicadoPor())
                .convenio(paciente.getDadosPessoais().getConvenio())
                .numeroInscricaoConvenio(paciente.getDadosPessoais().getNumeroInscricaoConvenio())
                // Responsável
                .responsavelNome(paciente.getResponsavel().getNome())
                .responsavelRg(paciente.getResponsavel().getRg())
                .responsavelOrgao(paciente.getResponsavel().getOrgao())
                .responsavelEstadoCivil(paciente.getResponsavel().getEstadoCivil())
                .responsavelCpf(paciente.getResponsavel().getCpf())
                // Cônjuge
                .conjugeNome(paciente.getConjuge().getNome())
                .conjugeRg(paciente.getConjuge().getRg())
                .conjugeCpf(paciente.getConjuge().getCpf())
                // Anamnese
                .febreReumatica(paciente.getAnamnese().isFebreReumatica())
                .hepatite(paciente.getAnamnese().isHepatite())
                .diabetes(paciente.getAnamnese().isDiabetes())
                .hipertensao(paciente.getAnamnese().isHipertensao())
                .hiv(paciente.getAnamnese().isHiv())
                .alteracaoCoagulacao(paciente.getAnamnese().isAlteracaoCoagulacao())
                .reacoesAlergicas(paciente.getAnamnese().isReacoesAlergicas())
                .doencasSistemicas(paciente.getAnamnese().isDoencasSistemicas())
                .tratamentosMedicos(paciente.getAnamnese().getTratamentosMedicos())
                .internacaoRecente(paciente.getAnamnese().isInternacaoRecente())
                .medicacaoAtual(paciente.getAnamnese().getMedicacaoAtual())
                .fumante(paciente.getAnamnese().isFumante())
                .quantidadeFumo(paciente.getAnamnese().getQuantidadeFumo())
                .bebidas(paciente.getAnamnese().isBebidas())
                .problemasCardiacos(paciente.getAnamnese().isProblemasCardiacos())
                .problemasRenais(paciente.getAnamnese().isProblemasRenais())
                .problemasGastricos(paciente.getAnamnese().isProblemasGastricos())
                .problemasRespiratorios(paciente.getAnamnese().isProblemasRespiratorios())
                .problemasAlergicos(paciente.getAnamnese().isProblemasAlergicos())
                .problemasArticulares(paciente.getAnamnese().isProblemasArticulares())
                .queixaPrincipal(paciente.getAnamnese().getQueixaPrincipal())
                .sofreDoenca(paciente.getAnamnese().isSofreDoenca())
                .qualDoenca(paciente.getAnamnese().getQualDoenca())
                .tratamentoMedicoAtual(paciente.getAnamnese().isTratamentoMedicoAtual())
                .gravidez(paciente.getAnamnese().isGravidez())
                .usoMedicacao(paciente.getAnamnese().isUsoMedicacao())
                .nomeMedico(paciente.getAnamnese().getNomeMedico())
                .alergia(paciente.getAnamnese().isAlergia())
                .alergiaTipo(paciente.getAnamnese().getAlergiaTipo())
                .cirurgia(paciente.getAnamnese().isCirurgia())
                .cirurgiaTipo(paciente.getAnamnese().getCirurgiaTipo())
                .cicatrizacao(paciente.getAnamnese().isCicatrizacao())
                .anestesia(paciente.getAnamnese().isAnestesia())
                .hemorragia(paciente.getAnamnese().isHemorragia())
                .habitos(paciente.getAnamnese().getHabitos())
                .antecedentesFamiliares(paciente.getAnamnese().getAntecedentesFamiliares())
                // Inspeção Bucal
                .lingua(paciente.getInspecaoBucal().getLingua())
                .mucosa(paciente.getInspecaoBucal().getMucosa())
                .palato(paciente.getInspecaoBucal().getPalato())
                .face(paciente.getInspecaoBucal().getFace())
                .labios(paciente.getInspecaoBucal().getLabios())
                .alteracaoOclusao(paciente.getInspecaoBucal().getAlteracaoOclusao())
                .tipoOclusao(paciente.getInspecaoBucal().getTipoOclusao())
                .protese(paciente.getInspecaoBucal().getProtese())
                .tipoProtese(paciente.getInspecaoBucal().getTipoProtese())
                .gengivas(paciente.getInspecaoBucal().getGengivas())
                .glandulas(paciente.getInspecaoBucal().getGlandulas())
                .outrasObservacoes(paciente.getInspecaoBucal().getOutrasObservacoes())
                .localData(paciente.getInspecaoBucal().getLocalData())
                // Data de Cadastro
                .dataCadastro(formatDateTime(paciente.getDataCadastro()))
                .build();
    }

    /**
     * Converte uma lista de Paciente para uma lista de PacienteResponse.
     */
    public List<PacienteResponse> toPacienteResponseList(List<Paciente> pacientes) {
        return pacientes.stream()
                .map(this::toPacienteResponse)
                .toList();
    }

    /**
     * Atualiza uma entidade Paciente existente com dados de um DTO.
     *
     * @param paciente Entidade Paciente a ser atualizada.
     * @param request DTO com os novos dados.
     */
    public void updatePacienteFromDto(Paciente paciente, PacienteRequestDTO request) {
        // Atualiza as subentidades
        paciente.setDadosPessoais(mapToDadosPessoais(request));
        paciente.setResponsavel(mapToResponsavel(request));
        paciente.setCone(mapToConjuge(request));
        paciente.setAnamnese(mapToAnamnese(request));
        paciente.setInspecaoBucal(mapToInspecaoBucal(request));
        // O ID, prontuário e dataCadastro não são alterados
    }

    // ============================================================
    // MÉTODOS DE MAPEAMENTO PARA SUBENTIDADES
    // ============================================================

    private DadosPessoais mapToDadosPessoais(PacienteRequestDTO request) {
        return DadosPessoais.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .rg(request.getRg())
                .orgaoExpedidor(request.getOrgaoExpedidor())
                .dataNascimento(parseDate(request.getDataNascimento()))
                .naturalidade(request.getNaturalidade())
                .nacionalidade(request.getNacionalidade())
                .estadoCivil(request.getEstadoCivil())
                .profissao(request.getProfissao())
                .enderecoResidencial(request.getEnderecoResidencial())
                .cpf(request.getCpf())
                .sexo(request.getSexo())
                .telefone(request.getTelefone())
                .indicadoPor(request.getIndicadoPor())
                .convenio(request.getConvenio())
                .numeroInscricaoConvenio(request.getNumeroInscricaoConvenio())
                .build();
    }

    private Responsavel mapToResponsavel(PacienteRequestDTO request) {
        return Responsavel.builder()
                .nome(request.getResponsavelNome())
                .rg(request.getResponsavelRg())
                .orgao(request.getResponsavelOrgao())
                .estadoCivil(request.getResponsavelEstadoCivil())
                .cpf(request.getResponsavelCpf())
                .build();
    }

    private Conjuge mapToConjuge(PacienteRequestDTO request) {
        return Conjuge.builder()
                .nome(request.getConjugeNome())
                .rg(request.getConjugeRg())
                .cpf(request.getConjugeCpf())
                .build();
    }

    private Anamnese mapToAnamnese(PacienteRequestDTO request) {
        return Anamnese.builder()
                .febreReumatica(request.isFebreReumatica())
                .hepatite(request.isHepatite())
                .diabetes(request.isDiabetes())
                .hipertensao(request.isHipertensao())
                .hiv(request.isHiv())
                .alteracaoCoagulacao(request.isAlteracaoCoagulacao())
                .reacoesAlergicas(request.isReacoesAlergicas())
                .doencasSistemicas(request.isDoencasSistemicas())
                .tratamentosMedicos(request.getTratamentosMedicos())
                .internacaoRecente(request.isInternacaoRecente())
                .medicacaoAtual(request.getMedicacaoAtual())
                .fumante(request.isFumante())
                .quantidadeFumo(request.getQuantidadeFumo())
                .bebidas(request.isBebidas())
                .problemasCardiacos(request.isProblemasCardiacos())
                .problemasRenais(request.isProblemasRenais())
                .problemasGastricos(request.isProblemasGastricos())
                .problemasRespiratorios(request.isProblemasRespiratorios())
                .problemasAlergicos(request.isProblemasAlergicos())
                .problemasArticulares(request.isProblemasArticulares())
                .queixaPrincipal(request.getQueixaPrincipal())
                .sofreDoenca(request.isSofreDoenca())
                .qualDoenca(request.getQualDoenca())
                .tratamentoMedicoAtual(request.isTratamentoMedicoAtual())
                .gravidez(request.isGravidez())
                .usoMedicacao(request.isUsoMedicacao())
                .nomeMedico(request.getNomeMedico())
                .alergia(request.isAlergia())
                .alergiaTipo(request.getAlergiaTipo())
                .cirurgia(request.isCirurgia())
                .cirurgiaTipo(request.getCirurgiaTipo())
                .cicatrizacao(request.isCicatrizacao())
                .anestesia(request.isAnestesia())
                .hemorragia(request.isHemorragia())
                .habitos(request.getHabitos())
                .antecedentesFamiliares(request.getAntecedentesFamiliares())
                .build();
    }

    private InspecaoBucal mapToInspecaoBucal(PacienteRequestDTO request) {
        return InspecaoBucal.builder()
                .lingua(request.getLingua())
                .mucosa(request.getMucosa())
                .palato(request.getPalato())
                .face(request.getFace())
                .labios(request.getLabios())
                .alteracaoOclusao(request.getAlteracaoOclusao())
                .tipoOclusao(request.getTipoOclusao())
                .protese(request.getProtese())
                .tipoProtese(request.getTipoProtese())
                .gengivas(request.getGengivas())
                .glandulas(request.getGlandulas())
                .outrasObservacoes(request.getOutrasObservacoes())
                .localData(request.getLocalData())
                .build();
    }

    // ============================================================
    // MÉTODOS AUXILIARES DE DATA
    // ============================================================

    /**
     * Converte String (dd/MM/yyyy) para LocalDate.
     *
     * @param dateString Data em formato String.
     * @return LocalDate.
     */
    private LocalDate parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateString, DATE_FORMATTER);
        } catch (Exception e) {
            // Lançar exceção de validação, que será tratada pelo ControllerAdvice
            throw new IllegalArgumentException("Formato de data de nascimento inválido. Use dd/MM/yyyy.");
        }
    }

    /**
     * Formata LocalDate para String (dd/MM/yyyy).
     */
    private String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : null;
    }

    /**
     * Formata LocalDateTime para String (dd/MM/yyyy HH:mm:ss).
     */
    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_TIME_FORMATTER) : null;
    }
}
