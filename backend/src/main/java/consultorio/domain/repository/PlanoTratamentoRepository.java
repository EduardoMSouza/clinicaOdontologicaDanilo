package consultorio.consultorio.domain.repository;

import consultorio.consultorio.domain.entity.PlanoTratamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanoTratamentoRepository extends JpaRepository<PlanoTratamento, Long> {
    List<PlanoTratamento> findByPacienteId(Long pacienteId);
    List<PlanoTratamento> findByDentistaId(Long dentistaId);
}
