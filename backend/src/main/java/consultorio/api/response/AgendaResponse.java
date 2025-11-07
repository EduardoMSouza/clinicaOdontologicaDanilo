package consultorio.consultorio.api.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class AgendaResponse {

    private Long id;

    private Long pacienteId;
    private String pacienteNome;

    private Long dentistaId;
    private String dentistaNome;

    private String descricao;
    private LocalDateTime horario;

    // ADICIONE ESTES CAMPOS:
    private Integer tempoConsultaMinutos;
    private LocalDateTime horarioFim;
    private String duracaoFormatada;

    private String status;
    private String observacoes;
    private LocalDateTime dataCriacao;
}