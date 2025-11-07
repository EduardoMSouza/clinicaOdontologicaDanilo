package consultorio.consultorio.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plano_tratamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanoTratamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dente;

    @Column(nullable = false)
    private String procedimento;

    @Column(nullable = false)
    private Double valor;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "valor_total", nullable = false)
    private double valorTotal;

    // Relacionamento com Paciente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    // Relacionamento com Dentista
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dentista_id")
    private Dentista dentista;
}