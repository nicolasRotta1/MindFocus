package com.example.habito_service.services;

import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.models.Habito;
import com.example.habito_service.models.Usuario;
import com.example.habito_service.repositories.HabitoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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
    public Habito criarHabito(Habito habito) {
        Usuario usuario = usuarioService.buscarUsuarioLogado();
        habito.setUsuario(usuario);
        return habitoRepository.save(habito);
    }

    // ============================
    // Listar hábitos do usuário logado
    // ============================
    public List<Habito> listarHabitosDoUsuario() {
        Usuario usuario = usuarioService.buscarUsuarioLogado();
        return habitoRepository.findByUsuarioId(usuario.getId());
    }

    // ============================
    // Buscar hábito por ID (verifica propriedade)
    // ============================
    public Habito buscarPorId(UUID id) {
        Usuario usuario = usuarioService.buscarUsuarioLogado();
        return habitoRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new HabitoNotFoundException("Hábito não encontrado para este usuário"));
    }

    // ============================
    // Atualizar hábito (atualização parcial)
    // ============================
    @Transactional
    public Habito atualizarHabito(UUID id, Habito habitoAtualizado) {
        Habito habitoExistente = buscarPorId(id);

        if (habitoAtualizado.getNome() != null && !habitoAtualizado.getNome().isBlank()) {
            habitoExistente.setNome(habitoAtualizado.getNome());
        }
        if (habitoAtualizado.getTipo() != null) {
            habitoExistente.setTipo(habitoAtualizado.getTipo());
        }
        if (habitoAtualizado.getStatus() != null) {
            habitoExistente.setStatus(habitoAtualizado.getStatus());
        }
        if (habitoAtualizado.getFrequencia() != null) {
            habitoExistente.setFrequencia(habitoAtualizado.getFrequencia());
        }
        // Só atualiza concluído se explicitamente definido
        if (habitoAtualizado.getConcluido() != null) {
            habitoExistente.setConcluido(habitoAtualizado.getConcluido());
        }

        return habitoExistente;
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
    public Habito concluirHabito(UUID id) {
        Habito habito = buscarPorId(id);
        habito.setConcluido(true);
        habito.setStatus(StatusHabito.CONCLUIDO);
        return habito;
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
