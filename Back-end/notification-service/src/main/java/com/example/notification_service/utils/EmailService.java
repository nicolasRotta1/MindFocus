package com.example.notification_service.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service; // Mudamos de @Component para @Service e evitamos o conflito MailSender

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    // Injeta o email de origem do application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    // Injeção de dependência do Spring Mail
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    /**
     * Envia um email com o conteúdo formatado como HTML.
     * Este é o método que você deve chamar no NotificationService.
     * * @param to O endereço de email do destinatário.
     * @param subject O assunto do email.
     * @param htmlContent O corpo do email em formato HTML.
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            // 'true' indica multipart (necessário para HTML) e 'UTF-8' garante acentuação correta
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            // O 'true' aqui indica que a string 'htmlContent' deve ser interpretada como HTML
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            // Lançamento de RuntimeException para permitir tratamento no serviço chamador
            throw new RuntimeException("Falha ao enviar email HTML para " + to + ": " + e.getMessage(), e);
        }
    }
}