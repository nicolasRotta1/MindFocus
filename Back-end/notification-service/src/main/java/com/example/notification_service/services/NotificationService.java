package com.example.notification_service.services;

import com.example.notification_service.dto.HabitoEvent;
import com.example.notification_service.utils.MailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final MailSender mailSender;

    @Autowired
    public NotificationService(MailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void processarEvento(HabitoEvent event) {
        log.info("Processando evento de hábito: {} | Hábito: {} | Usuário: {}",
                event.getEvento(), event.getNome(), event.getUsuarioId());

        String titulo = gerarTitulo(event);
        String mensagem = gerarMensagem(event);

        enviarPushNotification(event.getUsuarioId(), titulo, mensagem);

        enviarEmail(event.getUsuarioId(), titulo, mensagem);
    }

    private String gerarTitulo(HabitoEvent event) {
        return switch (event.getEvento().toUpperCase()) {
            case "CRIADO" -> "Novo Hábito Criado!";
            case "CONCLUIDO" -> "Parabéns! Hábito Concluído";
            case "ATUALIZADO" -> "Hábito Atualizado";
            case "DELETADO" -> "Hábito Removido";
            default -> "Atualização no seu Hábito";
        };
    }

    private String gerarMensagem(HabitoEvent event) {
        return switch (event.getEvento().toUpperCase()) {
            case "CRIADO" ->
                    String.format("Você acabou de criar o hábito <strong>%s</strong>! Vamos manter o foco?", event.getNome());
            case "CONCLUIDO" ->
                    String.format("Incrível! Você concluiu <strong>%s</strong> hoje. Continua assim!", event.getNome());
            case "ATUALIZADO" ->
                    String.format("O hábito <strong>%s</strong> foi atualizado com sucesso.", event.getNome());
            case "DELETADO" ->
                    String.format("O hábito <strong>%s</strong> foi removido da sua lista.", event.getNome());
            default ->
                    String.format("Algo aconteceu com seu hábito: %s", event.getNome());
        };
    }

    private void enviarPushNotification(UUID usuarioId, String titulo, String mensagem) {
        log.info("PUSH → Usuário {} | {} | {}", usuarioId, titulo, mensagem);
    }

    /**
     * Envia email usando sua classe utilitária MailSender
     */
    private void enviarEmail(UUID usuarioId, String titulo, String mensagem) {
        String emailDestino = "usuario@example.com";

        try {
            // Envia como HTML bonito
            mailSender.sendHtmlEmail(emailDestino, titulo, """
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #4CAF50;">%s</h2>
                        <p>%s</p>
                        <hr>
                        <small>Essa é uma mensagem automática do MindFocus.</small>
                    </body>
                    </html>
                    """.formatted(titulo, mensagem));

            log.info("Email enviado com sucesso para {}", emailDestino);
        } catch (Exception e) {
            log.error("Falha ao enviar email para usuário {} (email: {}): {}", usuarioId, emailDestino, e.getMessage());
        }

    }
}