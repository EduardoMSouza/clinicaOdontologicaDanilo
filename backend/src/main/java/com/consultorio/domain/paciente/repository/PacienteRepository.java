package com.consultorio.domain.paciente;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    List<Paciente> findByNomeContainingIgnoreCaseOrderByNome(String nome);

    Page<Paciente> findAllByOrderByDataCadastroDesc(Pageable pageable);

    List<Paciente> findAllByOrderByDataCadastroDesc();

    boolean existsByCpf(String cpf);
    boolean existsByRg(String rg);
    boolean existsByProntuario(String prontuario);

    boolean existsByCpfAndIdNot(String cpf, Long id);
    boolean existsByRgAndIdNot(String rg, Long id);
    boolean existsByProntuarioAndIdNot(String prontuario, Long id);

    Optional<Paciente> findByCpf(String cpf);
    Optional<Paciente> findByProntuario(String prontuario);

    @Query("SELECT p FROM Paciente p WHERE " +
            "LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(p.cpf) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(p.prontuario) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Paciente> buscarPorTermo(@Param("termo") String termo);
}