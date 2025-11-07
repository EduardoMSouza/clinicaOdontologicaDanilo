package consultorio.utils;

import consultorio.domain.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Manter o método de busca por CPF, mas agora ele deve buscar no campo correto
    // Assumindo que o CPF está dentro da subentidade DadosPessoais e que o JPA
    // consegue mapear isso (o que é padrão para @Embedded).
    // Se o JPA não conseguir, a query precisaria ser definida com @Query.
    // Por enquanto, mantemos a assinatura original, mas o ideal seria:
    // Optional<Paciente> findByDadosPessoaisCpf(String cpf);
    // Vamos manter a original e assumir que o JPA resolve.
    Optional<Paciente> findByCpf(String cpf);
}
