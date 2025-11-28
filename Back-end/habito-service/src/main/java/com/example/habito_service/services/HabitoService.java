package com.example.habito_service.services;

import com.example.habito_service.RabbitMQ.HabitoProducer;
import com.example.habito_service.dto.HabitoEvent;
import com.example.habito_service.dto.HabitoRequest;
import com.example.habito_service.dto.HabitoResponse;
import com.example.habito_service.enums.FrequenciaHabito;
import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.enums.TipoHabito;
import com.example.habito_service.models.Habito;
import com.example.habito_service.models.Usuario;
import com.example.habito_service.repositories.HabitoRepository;
import com.example.habito_service.specification.HabitoSpecification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HabitoService {

    private final HabitoRepository habitoRepository;
    private final UsuarioService usuarioService;
    private final HabitoProducer habitoProducer; // ← injetando producer

    public HabitoService(HabitoRepository habitoRepository,
                         UsuarioService usuarioService,
                         HabitoProducer habitoProducer) {
        this.habitoRepository = habitoRepository;
        this.usuarioService = usuarioService;
        this.habitoProducer = habitoProducer;
    }

    // ============================
    // Criar hábito
    // ============================
    public HabitoResponse criarHabito(HabitoRequest dto) {
        Usuario usuario = usuarioService.buscarUsuarioLogado();
        Habito habito = dto.toEntity(usuario);

        habito.setCriadoEm(LocalDateTime.now());
        habito.setAtualizadoEm(LocalDateTime.now());

        Habito salvo = habitoRepository.save(habito);

        // Criar evento
        HabitoEvent event = new HabitoEvent(salvo.getId(), salvo.getNome(), usuario.getId(),
                "CRIADO", LocalDateTime.now());

        habitoProducer.enviarHabitoCriado(event);
        habitoProducer.enviarNotificacao(event);

        return HabitoResponse.fromEntity(salvo);
    }

    // ============================
    // Listar hábitos do usuário com filtros
    // ============================
    public List<HabitoResponse> listarHabitosDoUsuario(
            String nome,
            TipoHabito tipo,
            StatusHabito status,
            FrequenciaHabito frequencia,
            Boolean concluido,
            LocalDateTime criadoEmInicio,
            LocalDateTime criadoEmFim,
            LocalDateTime atualizadoEmInicio,
            LocalDateTime atualizadoEmFim
    ) {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();

        Specification<Habito> spec = HabitoSpecification.comFiltros(
                nome, tipo, status, frequencia, concluido,
                criadoEmInicio, criadoEmFim,
                atualizadoEmInicio, atualizadoEmFim,
                usuarioId
        );

        return habitoRepository.findAll(spec)
                .stream()
                .map(HabitoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ============================
    // Buscar hábito por ID
    // ============================
    public Habito buscarPorId(UUID id) {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();

        return habitoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new HabitoNotFoundException("Hábito não encontrado para este usuário"));
    }

    // ============================
    // Atualizar hábito
    // ============================
    @Transactional
    public HabitoResponse atualizarHabito(UUID id, HabitoRequest dto) {
        Habito habitoExistente = buscarPorId(id);

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            habitoExistente.setNome(dto.getNome());
        }
        if (dto.getTipo() != null) {
            habitoExistente.setTipo(dto.getTipo());
        }
        if (dto.getStatus() != null) {
            habitoExistente.setStatus(dto.getStatus());
        }
        if (dto.getFrequencia() != null) {
            habitoExistente.setFrequencia(dto.getFrequencia());
        }
        if (dto.getConcluido() != null) {
            habitoExistente.setConcluido(dto.getConcluido());
            if (dto.getConcluido()) {
                habitoExistente.setStatus(StatusHabito.CONCLUIDO);
                habitoExistente.setProgresso(100);
            }
        }
        if (dto.getProgresso() != null) {
            habitoExistente.setProgresso(dto.getProgresso());
        }

        habitoExistente.setAtualizadoEm(LocalDateTime.now());

        // Criar evento de atualização
        HabitoEvent event = new HabitoEvent(
                habitoExistente.getId(),
                habitoExistente.getNome(),
                habitoExistente.getUsuario().getId(),
                "ATUALIZADO",
                LocalDateTime.now()
        );
        habitoProducer.enviarHabitoCriado(event);
        habitoProducer.enviarNotificacao(event);

        return HabitoResponse.fromEntity(habitoExistente);
    }

    // ============================
    // Deletar hábito
    // ============================
    public void deletarHabito(UUID id) {
        Habito habito = buscarPorId(id);
        habitoRepository.delete(habito);

        // Criar evento de deleção
        HabitoEvent event = new HabitoEvent(
                habito.getId(),
                habito.getNome(),
                habito.getUsuario().getId(),
                "DELETADO",
                LocalDateTime.now()
        );
        habitoProducer.enviarHabitoCriado(event); // ou criar "enviarHabitoDeletado"
        habitoProducer.enviarNotificacao(event);
    }


    // ============================
    // Exceções personalizadas
    // ============================
    public static class HabitoNotFoundException extends RuntimeException {
        public HabitoNotFoundException(String message) {
            super(message);
        }
    }
}
