package consultorio.consultorio.domain.repository;

import consultorio.consultorio.domain.entity.Dentista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DentistaRepository extends JpaRepository<Dentista, Long> {

    Optional<Dentista> findByCro(String cro);

    Optional<Dentista> findByEmail(String email);

    List<Dentista> findByAtivoTrue();

    List<Dentista> findByAtivoFalse();

    List<Dentista> findByEspecialidadeContainingIgnoreCase(String especialidade);

    @Query("SELECT d FROM Dentista d WHERE LOWER(d.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND d.ativo = true")
    List<Dentista> findByNomeContainingIgnoreCaseAndAtivo(@Param("nome") String nome);

    boolean existsByCro(String cro);

    boolean existsByEmail(String email);

    boolean existsByCroAndIdNot(String cro, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsById(Long id);
}