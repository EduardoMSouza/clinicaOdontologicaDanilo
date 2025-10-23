package com.consultorio.config;

import com.consultorio.domain.agenda.Agenda;
import com.consultorio.domain.agenda.AgendaRepository;
import com.consultorio.domain.agenda.StatusAgendamento;
import com.consultorio.domain.dentista.Dentista;
import com.consultorio.domain.dentista.DentistaRepository;
import com.consultorio.domain.paciente.Paciente;
import com.consultorio.domain.paciente.PacienteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedDatabase(
            DentistaRepository dentistaRepository,
            PacienteRepository pacienteRepository,
            AgendaRepository agendaRepository
    ) {
        return args -> {
            if (dentistaRepository.count() == 0) {
                Dentista dentista = new Dentista();
                dentista.setNome("Dra. Ana Costa");
                dentista.setCro("CRO-12345");
                dentista.setEspecialidade("Ortodontia");
                dentista.setTelefone("(11) 90000-0000");
                dentista.setEmail("ana.costa@odontoclinica.com");
                dentistaRepository.save(dentista);
            }

            if (pacienteRepository.count() == 0) {
                Paciente paciente = new Paciente();
                paciente.setNome("Marcos Pereira");
                paciente.setCpf("123.456.789-00");
                paciente.setTelefone("(11) 98888-0000");
                paciente.setEmail("marcos.pereira@email.com");
                paciente.setDataNascimento("1989-04-15");
                pacienteRepository.save(paciente);
            }

            if (agendaRepository.count() == 0) {
                Paciente paciente = pacienteRepository.findAll().stream().findFirst().orElse(null);
                Dentista dentista = dentistaRepository.findAll().stream().findFirst().orElse(null);

                if (paciente != null && dentista != null) {
                    Agenda agenda = new Agenda();
                    agenda.setPaciente(paciente);
                    agenda.setDentista(dentista);
                    agenda.setDataHora(LocalDateTime.now().plusDays(1).withHour(9).withMinute(30).withSecond(0).withNano(0));
                    agenda.setStatus(StatusAgendamento.CONFIRMADO);
                    agenda.setObservacoes("Avaliação inicial e radiografia");
                    agendaRepository.save(agenda);
                }
            }
        };
    }
}
