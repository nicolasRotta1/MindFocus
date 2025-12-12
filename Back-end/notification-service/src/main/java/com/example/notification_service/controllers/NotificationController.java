package com.example.notification_service.controllers;

import com.example.notification_service.models.Notificacao;
import com.example.notification_service.repositories.NotificacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificacaoRepository notificacaoRepository;

    public NotificationController(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    /**
     * Extrai o ID do usuário autenticado do SecurityContext (JWT).
     */
    private UUID getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("Usuário não autenticado");
        }

        if (auth.getPrincipal() instanceof UUID) {
            return (UUID) auth.getPrincipal();
        }

        if (auth.getPrincipal() instanceof String) {
            return UUID.fromString((String) auth.getPrincipal());
        }

        throw new IllegalStateException("Usuário não autenticado ou tipo de principal inválido");
    }

    // ================================
    // Listar notificações do usuário autenticado
    // ================================
    @GetMapping
    public ResponseEntity<List<Notificacao>> listNotifications() {
        UUID usuarioId = getAuthenticatedUserId();
        List<Notificacao> list = notificacaoRepository.findByUsuarioIdOrderByCriadaEmDesc(usuarioId);
        return ResponseEntity.ok(list);
    }

    // ================================
    // Contar notificações não lidas do usuário autenticado
    // ================================
    @GetMapping("/unread/count")
    public ResponseEntity<Long> unreadCount() {
        UUID usuarioId = getAuthenticatedUserId();
        long count = notificacaoRepository.countByUsuarioIdAndLidaFalse(usuarioId);
        return ResponseEntity.ok(count);
    }

    // ================================
    // Obter notificação específica (somente o proprietário)
    // ================================
    @GetMapping("/{notificacaoId}")
    public ResponseEntity<Notificacao> getNotification(@PathVariable UUID notificacaoId) {
        UUID usuarioId = getAuthenticatedUserId();
        Optional<Notificacao> opt = notificacaoRepository.findById(notificacaoId);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Notificacao notificacao = opt.get();
        // Validar proprietário
        if (!notificacao.getUsuarioId().equals(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(notificacao);
    }

    // ================================
    // Marcar como lida (somente o proprietário)
    // ================================
    @PutMapping("/{notificacaoId}/read")
    public ResponseEntity<Void> markRead(@PathVariable UUID notificacaoId) {
        UUID usuarioId = getAuthenticatedUserId();
        Optional<Notificacao> opt = notificacaoRepository.findById(notificacaoId);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Notificacao notificacao = opt.get();
        // Validar proprietário
        if (!notificacao.getUsuarioId().equals(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);
        return ResponseEntity.ok().build();
    }

    // ================================
    // Teste: Criar uma notificação para o usuário autenticado
    // ================================
    @PostMapping("/test")
    public ResponseEntity<Notificacao> createTestNotification(
            @RequestParam String titulo,
            @RequestParam String mensagem) {
        UUID usuarioId = getAuthenticatedUserId();
        Notificacao notificacao = new Notificacao();
        notificacao.setUsuarioId(usuarioId);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);
        notificacao.setTipo("teste");
        notificacao.setLida(false);
        Notificacao saved = notificacaoRepository.save(notificacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
