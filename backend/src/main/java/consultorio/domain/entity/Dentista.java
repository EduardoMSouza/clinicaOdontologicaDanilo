package consultorio.consultorio.domain.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "dentista")
public class Dentista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cro;

    private String especialidade;
    private String telefone;
    private String email;

    @Builder.Default
    private Boolean ativo = true;

    // ============================================================
    // RELACIONAMENTO COM AGENDA (1 dentista -> N agendas)
    // ============================================================
    @OneToMany(mappedBy = "dentista", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Builder.Default
    private List<Agenda> agendas = new ArrayList<>();

    // ============================================================
    // MÉTODOS AUXILIARES PARA MANIPULAR AGENDA
    // ============================================================
    public void adicionarAgenda(Agenda agenda) {
        if (agenda != null && !agendas.contains(agenda)) {
            agendas.add(agenda);
            agenda.setDentista(this);
        }
    }

    public void removerAgenda(Agenda agenda) {
        if (agenda != null && agendas.remove(agenda)) {
            agenda.setDentista(null);
        }
    }

    // ============================================================
    // MÉTODO PARA CRIAR AGENDA AUTOMATICAMENTE
    // ============================================================
    @PrePersist
    protected void onCreate() {
        // Cria uma agenda inicial para o dentista
        criarAgendaInicial();
    }

    private void criarAgendaInicial() {
        Agenda agendaInicial = Agenda.builder()
                .descricao("Agenda do Dr. " + this.nome)
                .horario(java.time.LocalDateTime.now().plusDays(1)) // Agenda para amanhã
                .dentista(this)
                .status("DISPONÍVEL")
                .observacoes("Agenda criada automaticamente")
                .build();

        this.agendas.add(agendaInicial);
    }
}