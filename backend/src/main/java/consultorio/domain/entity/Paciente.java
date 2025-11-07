package consultorio.utils;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "paciente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String prontuario; // Gerado no Service

    @Embedded
    private DadosPessoais dadosPessoais;

    @Embedded
    private Responsavel responsavel;

    @Embedded
    private Conjuge conjuge;

    @Embedded
    private Anamnese anamnese;

    @Embedded
    private InspecaoBucal inspecaoBucal;

    @Column(name = "data_cadastro", updatable = false, nullable = false)
    private LocalDateTime dataCadastro;

    // ============================================================
    // RELACIONAMENTOS (Manter apenas a estrutura, assumindo que as classes existem)
    // ============================================================
    // @OneToMany(mappedBy = "paciente", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Agenda> agendas = new ArrayList<>();

    // @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<PlanoTratamento> planosTratamento = new ArrayList<>();

    // @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<EvolucaoTratamento> evolucoesTratamento = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.dataCadastro == null) {
            this.dataCadastro = LocalDateTime.now();
        }
        // A geração do prontuário e a criação de planos/evoluções iniciais
        // foram movidas para a camada de Serviço (Service).
    }
}
