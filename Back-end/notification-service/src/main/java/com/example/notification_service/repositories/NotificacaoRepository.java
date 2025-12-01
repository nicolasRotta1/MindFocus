package com.example.notification_service.repositories;

import com.example.notification_service.models.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NotificacaoRepository extends JpaRepository<Notificacao, UUID> {
    List<Notificacao> findByUsuarioIdOrderByCriadaEmDesc(UUID usuarioId);
    List<Notificacao> findByUsuarioIdAndLidaFalseOrderByCriadaEmDesc(UUID usuarioId);
    long countByUsuarioIdAndLidaFalse(UUID usuarioId);
    void deleteByUsuarioId(UUID usuarioId);
}
