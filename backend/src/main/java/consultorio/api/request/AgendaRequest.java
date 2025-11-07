package consultorio.consultorio.api.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
public class AgendaRequest {

    @NotNull
    private Long pacienteId;

    @NotNull
    private Long dentistaId;

    @NotNull
    private String descricao;

    @Future
    @NotNull
    private LocalDateTime horario;

    // ADICIONE ESTE CAMPO:
    @NotNull
    @Positive
    private Integer tempoConsultaMinutos;

    private String observacoes;
}