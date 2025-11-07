package com.consultorio.domain.paciente;

import com.consultorio.domain.paciente.Enums.EstadoCivil;
import com.consultorio.domain.paciente.Enums.Sexo;
import com.consultorio.domain.paciente.Enums.StatusPaciente;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pacientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === DADOS PESSOAIS BÁSICOS ===
    @Column(nullable = false, length = 100)
    private String nome;

    @Column(unique = true, length = 14)
    private String cpf;

    @Column(length = 20)
    private String rg;

    @Column(length = 50)
    private String orgaoExpedidor;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String telefone;

    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Sexo sexo;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EstadoCivil estadoCivil;

    // === ENDEREÇO ===
    @Embedded
    private Endereco endereco;

    // === PROFISSIONAL ===
    @Column(length = 100)
    private String profissao;

    @Column(length = 50)
    private String naturalidade;

    @Column(length = 50)
    private String nacionalidade;

    // === CONVÊNIO ===
    @Column(length = 100)
    private String convenio;

    @Column(length = 50)
    private String numeroCarteirinha;

    // === CONTATO DE EMERGÊNCIA ===
    @Embedded
    private ContatoEmergencia contatoEmergencia;

    // === RESPONSÁVEL (para menores ou dependentes) ===
    @Embedded
    private Responsavel responsavel;

    // === ANAMNESE ===
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "anamnese_id")
    private Anamnese anamnese;

    // === DADOS DE CONTROLE ===
    @Column(length = 20)
    private String prontuario;

    @Column(length = 100)
    private String indicadoPor;

    @Column(length = 1000)
    private String observacoesGerais;

    // === TIMESTAMPS ===
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dataCadastro;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    // === STATUS ===
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatusPaciente status;

    // === MÉTODOS ÚTEIS ===
    public int getIdade() {
        if (dataNascimento == null) return 0;
        return LocalDate.now().getYear() - dataNascimento.getYear();
    }

    public boolean isMenorDeIdade() {
        return getIdade() < 18;
    }

    // === CLASSES EMBUTIDAS ===

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Endereco {
        @Column(length = 200)
        private String logradouro;

        @Column(length = 10)
        private String numero;

        @Column(length = 100)
        private String complemento;

        @Column(length = 100)
        private String bairro;

        @Column(length = 100)
        private String cidade;

        @Column(length = 2)
        private String estado;

        @Column(length = 9)
        private String cep;
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ContatoEmergencia {
        @Column(length = 100)
        private String nome;

        @Column(length = 20)
        private String telefone;

        @Column(length = 50)
        private String parentesco;
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Responsavel {
        @Column(length = 100)
        private String nome;

        @Column(length = 20)
        private String rg;

        @Column(length = 50)
        private String orgaoExpedidor;

        @Column(length = 14)
        private String cpf;

        @Enumerated(EnumType.STRING)
        @Column(length = 20)
        private EstadoCivil estadoCivil;

        @Column(length = 100)
        private String nomeConjuge;

        @Column(length = 14)
        private String cpfConjuge;
    }
}

