package com.example.habito_service.RabbitMQ;

import com.example.habito_service.dto.HabitoEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * HabitoProducer é responsável por enviar eventos de hábitos
 * para o RabbitMQ.
 */
@Component
public class HabitoProducer {

    private final RabbitTemplate rabbitTemplate;

    // Exchange do RabbitMQ (Adicionado fallback)
    @Value("${mindfocus.rabbitmq.exchange:mindfocus.event.exchange}")
    private String exchange;

    // Routing Keys (Adicionado fallback em todas)
    @Value("${mindfocus.rabbitmq.routing-keys.habito:habito.internal}")
    private String habitoRoutingKey;

    // CHAVE CORRETA PARA NOTIFICAÇÃO (DEVE SER 'habito.criado')
    @Value("${mindfocus.rabbitmq.routing-keys.notification:habito.criado}")
    private String notificationRoutingKey;

    @Value("${mindfocus.rabbitmq.routing-keys.audit:audit.log}")
    private String auditRoutingKey;

    @Value("${mindfocus.rabbitmq.routing-keys.schedule:schedule.check}")
    private String scheduleRoutingKey;

    /**
     * Construtor com injeção do RabbitTemplate.
     * Força o uso do conversor JSON para esta instância específica.
     */
    public HabitoProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        // Garante que esta instância use o conversor JSON
        this.rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
    }

    /**
     * MÉTODO CORRIGIDO:
     * O evento de criação de hábito, se destina à notificação, deve usar
     * a chave de roteamento de notificação.
     */
    public void enviarHabitoCriado(HabitoEvent habitoEvent) {
        try {
            // CORREÇÃO: Usando a notificationRoutingKey que é ligada à fila do notification-service
            rabbitTemplate.convertAndSend(exchange, notificationRoutingKey, habitoEvent);
            System.out.println("Evento de hábito criado enviado com sucesso: " + habitoEvent +
                    " usando a chave de roteamento: " + notificationRoutingKey);
        } catch (Exception e) {
            System.err.println("ERRO ao enviar mensagem para RabbitMQ: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void enviarNotificacao(HabitoEvent habitoEvent) {
        rabbitTemplate.convertAndSend(exchange, notificationRoutingKey, habitoEvent);
    }

    public void enviarAuditEvent(HabitoEvent habitoEvent) {
        rabbitTemplate.convertAndSend(exchange, auditRoutingKey, habitoEvent);
    }

    public void enviarScheduleEvent(HabitoEvent habitoEvent) {
        rabbitTemplate.convertAndSend(exchange, scheduleRoutingKey, habitoEvent);
    }
}