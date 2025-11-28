package com.example.notification_service.services;

import com.example.notification_service.dto.HabitoEvent;
import com.example.notification_service.utils.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void processarEvento(HabitoEvent event) {
        // 1. Validação de Segurança (Evita NullPointerException)
        if (event == null || event.getEvento() == null) {
            log.warn("Evento inválido ou nulo recebido. Ignorando.");
            return;
        }

        // 2. Validação de E-mail
        if (event.getUserEmail() == null || event.getUserEmail().isBlank()) {
            log.error("Email não fornecido para o usuário ID: {}. Notificação cancelada.", event.getUsuarioId());
            return;
        }

        log.info("Processando evento: {} | Hábito: {} | Email: {}",
                event.getEvento(), event.getNome(), event.getUserEmail());

        String titulo = gerarTitulo(event);
        String mensagem = gerarMensagem(event);

        // Envia Push (Simulado)
        enviarPushNotification(event.getUsuarioId(), titulo, mensagem);

        // Envia Email (Real)
        enviarEmail(event.getUserEmail(), titulo, mensagem);
    }

    private String gerarTitulo(HabitoEvent event) {
        // Safe check para toUpperCase
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

    private void enviarPushNotification(UUID usuarioId, String titulo, String mensagem) {
        log.info("PUSH ENVIADO → Usuário: {} | Título: {}", usuarioId, titulo);
    }

    private void enviarEmail(String emailDestino, String titulo, String mensagem) {
        try {
            String htmlTemplate = """
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #4CAF50;">%s</h2>
                        <p style="font-size: 16px;">%s</p>
                        <hr style="border: 0; border-top: 1px solid #eee;">
                        <small style="color: #888;">Essa é uma mensagem automática do MindFocus.</small>
                    </body>
                    </html>
                    """.formatted(titulo, mensagem);

            emailService.sendHtmlEmail(emailDestino, titulo, htmlTemplate);
            log.info("Email enviado com sucesso para: {}", emailDestino);
        } catch (Exception e) {
            log.error("Falha crítica ao enviar email para {}: {}", emailDestino, e.getMessage());
        }
    }
}