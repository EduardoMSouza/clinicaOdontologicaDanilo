package consultorio.consultorio.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evolucao_tratamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvolucaoTratamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_procedimento", nullable = false)
    private String dataProcedimento;

    @Column(name = "evolucao_intercorrencias", columnDefinition = "TEXT", nullable = false)
    private String evolucaoIntercorrenciasTratamento;

    // Relacionamento com Paciente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    // Relacionamento com Dentista
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dentista_id")
    private Dentista dentista;

    // Relacionamento com PlanoTratamento (opcional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plano_tratamento_id")
    private PlanoTratamento planoTratamento;
}