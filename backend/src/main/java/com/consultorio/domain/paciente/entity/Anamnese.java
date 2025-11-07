package com.consultorio.domain.paciente;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "anamneses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Anamnese {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    // === HISTÓRICO MÉDICO ===
    @ElementCollection
    @CollectionTable(name = "paciente_doencas_preexistentes",
            joinColumns = @JoinColumn(name = "anamnese_id"))
    @Column(name = "doenca")
    private List<String> doencasPreexistentes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "paciente_alergias",
            joinColumns = @JoinColumn(name = "anamnese_id"))
    @Column(name = "alergia")
    private List<String> alergias = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "paciente_medicamentos",
            joinColumns = @JoinColumn(name = "anamnese_id"))
    @Column(name = "medicamento")
    private List<String> medicamentosEmUso = new ArrayList<>();

    // === HÁBITOS ===
    private boolean fumante;
    private Integer cigarrosPorDia;
    private Integer anosFumando;

    private boolean consomeAlcool;
    private String frequenciaAlcool;

    // === HISTÓRICO CIRÚRGICO ===
    private boolean historicoCirurgico;
    private String detalhesCirurgias;

    // === PROBLEMAS ESPECÍFICOS ===
    private boolean problemasCardiacos;
    private boolean problemasRenais;
    private boolean problemasHepaticos;
    private boolean problemasRespiratorios;
    private boolean diabetes;
    private boolean hipertensao;
    private boolean problemasCoagulacao;

    // === QUEIXA PRINCIPAL ===
    @Column(length = 500)
    private String queixaPrincipal;

    @Column(length = 1000)
    private String evolucaoDoencaAtual;

    // === EXAME CLÍNICO ===
    @Embedded
    private ExameClinico exameClinico;

    @CreationTimestamp
    private LocalDateTime dataPreenchimento;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExameClinico {
        private String lingua;
        private String mucosa;
        private String palato;
        private String labios;
        private String gengivas;
        private String face;
        private String ganglios;
        private String glandulasSalivares;
        private boolean alteracaoOclusao;
        private String detalhesOclusao;
        private String observacoes;
    }
}