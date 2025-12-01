package com.example.notification_service.services;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.notification_service.dto.HabitoEvent;
import com.example.notification_service.models.Notificacao;
import com.example.notification_service.repositories.NotificacaoRepository;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificacaoRepository notificacaoRepository;

    public NotificationService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    public void processarEvento(HabitoEvent event) {
        if (event == null || event.getEvento() == null) {
            log.warn("Evento inválido ou nulo recebido. Ignorando.");
            return;
        }

        log.info("Processando evento: {} | Hábito: {}",
                event.getEvento(), event.getNome());

        String titulo = gerarTitulo(event);
        String mensagem = gerarMensagem(event);

        // Persiste notificação no banco
        try {
            Notificacao n = new Notificacao(event.getUsuarioId(), titulo, mensagem, event.getEvento());
            notificacaoRepository.save(n);
            log.info("Notificação persistida: {}", n);
        } catch (Exception e) {
            log.error("Falha ao persistir notificação para usuário {}: {}", event.getUsuarioId(), e.getMessage());
        }

        enviarPushNotification(event.getUsuarioId(), titulo, mensagem);
    }

    private String gerarTitulo(HabitoEvent event) {
        String tipoEvento = event.getEvento().toUpperCase();

        return switch (tipoEvento) {
            case "CRIADO" -> "Novo Hábito Criado!";
            case "CONCLUIDO" -> "Parabéns! Hábito Concluído";
            case "ATUALIZADO" -> "Hábito Atualizado";
            case "DELETADO" -> "Hábito Removido";
            default -> "Atualização no seu Hábito";
        };
    }

    private String gerarMensagem(HabitoEvent event) {
        String nomeHabito = event.getNome() != null ? event.getNome() : "Sem nome";
        String tipoEvento = event.getEvento().toUpperCase();

        return switch (tipoEvento) {
            case "CRIADO" ->
                    String.format("Você acabou de criar o hábito <strong>%s</strong>! Vamos manter o foco?", nomeHabito);
            case "CONCLUIDO" ->
                    String.format("Incrível! Você concluiu <strong>%s</strong> hoje. Continue assim!", nomeHabito);
            case "ATUALIZADO" ->
                    String.format("O hábito <strong>%s</strong> foi atualizado com sucesso.", nomeHabito);
            case "DELETADO" ->
                    String.format("O hábito <strong>%s</strong> foi removido da sua lista.", nomeHabito);
            default ->
                    String.format("Algo aconteceu com seu hábito: %s", nomeHabito);
        };
    }

    private void enviarPushNotification(UUID usuarioId, String titulo, @SuppressWarnings("unused") String mensagem) {
        log.info("PUSH ENVIADO → Usuário: {} | Título: {}", usuarioId, titulo);
    }
}