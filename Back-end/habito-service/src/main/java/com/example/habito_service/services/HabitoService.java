package com.example.habito_service.services;

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

    public HabitoService(HabitoRepository habitoRepository, UsuarioService usuarioService) {
        this.habitoRepository = habitoRepository;
        this.usuarioService = usuarioService;
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
        return HabitoResponse.fromEntity(salvo);
    }

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
                nome,
                tipo,
                status,
                frequencia,
                concluido,
                criadoEmInicio,
                criadoEmFim,
                atualizadoEmInicio,
                atualizadoEmFim,
                usuarioId
        );

        return habitoRepository.findAll(spec)
                .stream()
                .map(HabitoResponse::fromEntity)
                .collect(Collectors.toList());
    }



    // ============================
    // Buscar hábito por ID (verifica propriedade)
    // ============================
    public Habito buscarPorId(UUID id) {
        Usuario usuario = usuarioService.buscarUsuarioLogado();

        Habito habito = habitoRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new HabitoNotFoundException("Hábito não encontrado para este usuário"));

        return habito;
    }

    // ============================
    // Atualizar hábito (parcial / PATCH)
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

        return HabitoResponse.fromEntity(habitoExistente);
    }

    // ============================
    // Deletar hábito
    // ============================
    public void deletarHabito(UUID id) {
        Habito habito = buscarPorId(id);
        habitoRepository.delete(habito);
    }

    // ============================
    // Marcar hábito como concluído
    // ============================
    @Transactional
    public HabitoResponse concluirHabito(UUID id) {
        Habito habito = buscarPorId(id);
        habito.setConcluido(true);
        habito.setStatus(StatusHabito.CONCLUIDO);
        habito.setProgresso(100);
        habito.setAtualizadoEm(LocalDateTime.now());

        return HabitoResponse.fromEntity(habito);
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
