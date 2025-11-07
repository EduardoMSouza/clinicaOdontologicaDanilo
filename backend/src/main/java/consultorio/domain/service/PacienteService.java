package consultorio.utils;

import consultorio.domain.entity.Paciente;
import consultorio.domain.repository.PacienteRepository;
import consultorio.exception.RecursoNaoEncontradoException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    /**
     * Salva um novo paciente ou atualiza um existente.
     *
     * @param paciente O objeto Paciente a ser salvo.
     * @return O Paciente salvo.
     */
    @Transactional
    public Paciente salvar(Paciente paciente) {
        // Lógica de negócio: Geração de prontuário se for um novo paciente
        if (paciente.getId() == null || paciente.getProntuario() == null) {
            paciente.setProntuario(gerarNovoProntuario());
        }

        log.info("Salvando paciente: {} (Prontuário: {})", paciente.getDadosPessoais().getNome(), paciente.getProntuario());
        return pacienteRepository.save(paciente);
    }

    /**
     * Busca um paciente pelo ID.
     *
     * @param id O ID do paciente.
     * @return O Paciente encontrado.
     * @throws RecursoNaoEncontradoException se o paciente não for encontrado.
     */
    @Transactional(readOnly = true)
    public Paciente buscarPorId(Long id) {
        log.info("Buscando paciente por ID: {}", id);
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Paciente não encontrado com ID: " + id));
    }

    /**
     * Lista todos os pacientes.
     *
     * @return Uma lista de todos os Pacientes.
     */
    @Transactional(readOnly = true)
    public List<Paciente> listarTodos() {
        log.info("Listando todos os pacientes");
        return pacienteRepository.findAll();
    }

    /**
     * Exclui um paciente pelo ID.
     *
     * @param id O ID do paciente a ser excluído.
     * @throws RecursoNaoEncontradoException se o paciente não for encontrado.
     */
    @Transactional
    public void excluirPaciente(Long id) {
        log.info("Tentativa de exclusão do paciente ID: {}", id);

        // O método buscarPorId já lança a exceção se não encontrar
        Paciente paciente = buscarPorId(id);

        pacienteRepository.delete(paciente);
        log.info("Paciente ID {} excluído com sucesso", id);
    }

    /**
     * Método auxiliar para gerar um prontuário único.
     * A implementação real dependeria de um contador ou sequência no banco de dados.
     * Aqui, usamos um timestamp simples como placeholder.
     *
     * @return Uma string de prontuário.
     */
    private String gerarNovoProntuario() {
        // Implementação real deve garantir unicidade e ser thread-safe
        return "PRT-" + System.currentTimeMillis();
    }
}
