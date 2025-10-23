package com.consultorio.domain.paciente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    boolean existsByCpf(String cpf);
    boolean existsByCpfAndIdNot(String cpf, Long id);

    List<Paciente> findByNomeContainingIgnoreCase(String nome);
    List<Paciente> findByCpf(String cpf);
    List<Paciente> findByRg(String rg);
    List<Paciente> findByEmailContainingIgnoreCase(String email);
    List<Paciente> findByDataNascimento(String dataNascimento);
}
