package consultorio.consultorio.domain.repository;

import consultorio.consultorio.domain.entity.EvolucaoTratamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvolucaoTratamentoRepository extends JpaRepository<EvolucaoTratamento, Long> {
    List<EvolucaoTratamento> findByPacienteId(Long pacienteId);
    List<EvolucaoTratamento> findByPlanoTratamentoId(Long planoTratamentoId);
}
