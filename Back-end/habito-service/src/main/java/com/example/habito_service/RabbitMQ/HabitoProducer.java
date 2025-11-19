package com.example.habito_service.RabbitMQ;

import com.example.habito_service.models.Habito;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * HabitoProducer é responsável por enviar eventos de hábitos
 * para o RabbitMQ. Esses eventos podem ser consumidos por outros
 * microserviços, como notification-service, audit-service ou schedule-service.
 */
@Component
public class HabitoProducer {

    private final RabbitTemplate rabbitTemplate;

    // Exchange do RabbitMQ configurada no application.properties
    @Value("${mindfocus.rabbitmq.exchange}")
    private String exchange;

    // Routing key para eventos de hábito
    @Value("${mindfocus.rabbitmq.routing-keys.habito}")
    private String habitoRoutingKey;

    // Routing key para eventos de notificação
    @Value("${mindfocus.rabbitmq.routing-keys.notification}")
    private String notificationRoutingKey;

    // Routing key para eventos de auditoria
    @Value("${mindfocus.rabbitmq.routing-keys.audit}")
    private String auditRoutingKey;

    // Routing key para eventos de agendamento
    @Value("${mindfocus.rabbitmq.routing-keys.schedule}")
    private String scheduleRoutingKey;

    public HabitoProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Envia evento de hábito criado
     */
    public void enviarHabitoCriado(Habito habito) {
        rabbitTemplate.convertAndSend(exchange, habitoRoutingKey, habito);
        System.out.println("Evento de hábito criado enviado: " + habito);
    }

    /**
     * Envia evento de notificação (ex: para o notification-service)
     */
    public void enviarNotificacao(Habito habito) {
        rabbitTemplate.convertAndSend(exchange, notificationRoutingKey, habito);
        System.out.println("Evento de notificação enviado: " + habito);
    }

    /**
     * Envia evento de auditoria (ex: logs ou analytics)
     */
    public void enviarAuditEvent(Habito habito) {
        rabbitTemplate.convertAndSend(exchange, auditRoutingKey, habito);
        System.out.println("Evento de auditoria enviado: " + habito);
    }

    /**
     * Envia evento de agendamento (ex: lembretes)
     */
    public void enviarScheduleEvent(Habito habito) {
        rabbitTemplate.convertAndSend(exchange, scheduleRoutingKey, habito);
        System.out.println("Evento de agendamento enviado: " + habito);
    }
}
