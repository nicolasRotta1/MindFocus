package com.example.habito_service.services;

import com.example.habito_service.models.Usuario;
import com.example.habito_service.repositories.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ================================
    // Pega o ID do usuário logado (UUID)
    // ================================
    private UUID getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("Usuário não autenticado");
        }

        // Principal é UUID direto
        if (auth.getPrincipal() instanceof UUID) {
            return (UUID) auth.getPrincipal();
        }

        // Se por algum motivo ainda estiver como String
        if (auth.getPrincipal() instanceof String) {
            return UUID.fromString((String) auth.getPrincipal());
        }

        throw new IllegalStateException("Usuário não autenticado ou tipo de principal inválido");
    }

    // ================================
    // Salvar ou atualizar usuário
    // ================================
    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // ================================
    // Listar todos os usuários (somente admins)
    // ================================
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // ================================
    // Buscar o usuário logado
    // ================================
    public Usuario buscarUsuarioLogado() {
        UUID userId = getAuthenticatedUserId();
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));
    }

    // ================================
    // Buscar usuário por ID informado
    // ================================
    public Usuario buscarPorId(UUID id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + id + " não encontrado"));
    }

    // ================================
    // Remover o próprio usuário logado
    // ================================
    public void removerUsuarioLogado() {
        UUID userId = getAuthenticatedUserId();
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));
        usuarioRepository.delete(usuario);
    }
}
