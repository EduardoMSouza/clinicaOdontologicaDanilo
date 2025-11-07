package consultorio.consultorio.domain.repository;

import consultorio.consultorio.domain.entity.Agenda;
import consultorio.consultorio.domain.entity.Dentista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Long> {

    List<Agenda> findByDentistaAndHorarioBetween(
            Dentista dentista,
            LocalDateTime start,
            LocalDateTime end
    );

    // ADICIONE ESTE MÉTODO QUE ESTÁ FALTANDO:
    List<Agenda> findByDentistaIdAndHorarioBetween(
            Long dentistaId,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Agenda> findByPacienteId(Long pacienteId);

    List<Agenda> findByDentistaId(Long dentistaId);

    @Query("SELECT a FROM Agenda a WHERE a.horario BETWEEN :start AND :end")
    List<Agenda> findByPeriodo(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}