package consultorio.consultorio.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import consultorio.consultorio.utils.Calendario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agenda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private LocalDateTime horario;

    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "tempo_consulta_minutos")
    private Integer tempoConsultaMinutos;

    @ManyToOne
    @JoinColumn(
            name = "paciente_id",
            nullable = true,
            foreignKey = @ForeignKey(
                    name = "fk_agenda_paciente",
                    foreignKeyDefinition = "FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE SET NULL"
            )
    )
    @JsonIgnoreProperties({"agendas"})
    private Paciente paciente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dentista_id", nullable = false)
    @JsonBackReference
    private Dentista dentista;

    private String status;
    private String observacoes;

    @PrePersist
    protected void onCreate() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }

        // Validação automática ao criar
        Calendario.validarAgendamento(this);
    }

    @PreUpdate
    protected void onUpdate() {
        // Validação automática ao atualizar
        Calendario.validarAgendamento(this);
    }

    // Método para calcular o horário de fim
    public LocalDateTime getHorarioFim() {
        if (this.tempoConsultaMinutos != null && this.horario != null) {
            return Calendario.calcularHorarioFim(this.horario, this.tempoConsultaMinutos);
        }
        return this.horario;
    }

    // Método para obter a duração
    public java.time.Duration getDuracao() {
        if (this.tempoConsultaMinutos != null) {
            return Calendario.calcularDuracaoConsulta(this.tempoConsultaMinutos);
        }
        return java.time.Duration.ZERO;
    }
}