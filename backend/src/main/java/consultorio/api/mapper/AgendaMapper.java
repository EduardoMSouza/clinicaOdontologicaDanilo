package consultorio.consultorio.api.mapper;

import consultorio.consultorio.api.request.AgendaRequest;
import consultorio.consultorio.api.response.AgendaResponse;
import consultorio.consultorio.domain.entity.Agenda;
import consultorio.consultorio.domain.entity.Paciente;
import consultorio.consultorio.domain.entity.Dentista;
import consultorio.consultorio.domain.service.PacienteService;
import consultorio.consultorio.domain.service.DentistaService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AgendaMapper {

    private final ModelMapper mapper;
    private final PacienteService pacienteService;
    private final DentistaService dentistaService;

    public Agenda toAgenda(AgendaRequest request) {
        Agenda agenda = mapper.map(request, Agenda.class);

        // Busca e seta o dentista
        Dentista dentista = dentistaService.buscarPorId(request.getDentistaId())
                .orElseThrow(() -> new RuntimeException("Dentista não encontrado"));
        agenda.setDentista(dentista);

        // Busca e seta o paciente (se existir)
        if (request.getPacienteId() != null) {
            Paciente paciente = pacienteService.buscarPorId(request.getPacienteId())
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
            agenda.setPaciente(paciente);
        }

        return agenda;
    }

    public AgendaResponse toAgendaResponse(Agenda agenda){
        AgendaResponse response = mapper.map(agenda, AgendaResponse.class);

        // Mapeamento manual para campos adicionais
        if (agenda.getPaciente() != null) {
            response.setPacienteNome(agenda.getPaciente().getNome());
        }

        if (agenda.getDentista() != null) {
            response.setDentistaNome(agenda.getDentista().getNome());
        }

        // Calcula horário fim e formata duração
        response.setHorarioFim(agenda.getHorarioFim());

        if (agenda.getTempoConsultaMinutos() != null) {
            long horas = agenda.getTempoConsultaMinutos() / 60;
            long minutos = agenda.getTempoConsultaMinutos() % 60;

            if (horas > 0) {
                response.setDuracaoFormatada(String.format("%dh %02dmin", horas, minutos));
            } else {
                response.setDuracaoFormatada(String.format("%d min", minutos));
            }
        }

        return response;
    }

    public List<AgendaResponse> toAgendaResponseList(List<Agenda> agendas){
        return agendas.stream()
                .map(this::toAgendaResponse)
                .collect(Collectors.toList());
    }
}