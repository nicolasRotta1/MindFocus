package com.example.habito_service.controllers;

import com.example.habito_service.dto.UsuarioAtualizacaoDTO;
import com.example.habito_service.models.Usuario;
import com.example.habito_service.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ================================
    // Retorna dados do usuário autenticado
    // ================================
    @GetMapping("/atual")
    public ResponseEntity<Usuario> getUsuarioLogado() {
        Usuario usuario = usuarioService.buscarUsuarioLogado();
        return ResponseEntity.ok(usuario);
    }

    // ================================
    // Buscar qualquer usuário por ID (somente ADMIN)
    // ================================
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable UUID id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    // ================================
    // Atualizar dados do usuário logado
    // ================================
    @PutMapping("/atual")
    public ResponseEntity<String> atualizarUsuario(@Valid @RequestBody UsuarioAtualizacaoDTO dto) {
        Usuario usuarioBase = usuarioService.buscarUsuarioLogado();

        // Atualização manual e segura (apenas campos permitidos)
        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            usuarioBase.setNome(dto.getNome());
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            usuarioBase.setEmail(dto.getEmail());
        }
        if (dto.getTelefone() != null && !dto.getTelefone().isBlank()) {
            usuarioBase.setTelefone(dto.getTelefone());
        }

        usuarioService.salvar(usuarioBase);
        return ResponseEntity.ok("Dados atualizados com sucesso");
    }

    // ================================
    // Deletar usuário logado
    // ================================
    @DeleteMapping("/atual")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarUsuarioLogado() {
        usuarioService.removerUsuarioLogado();
    }
}
