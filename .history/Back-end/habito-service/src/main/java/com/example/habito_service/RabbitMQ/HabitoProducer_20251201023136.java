package com.example.habito_service.RabbitMQ;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.habito_service.dto.HabitoEvent;

/* Envia eventos de hábito para o RabbitMQ. */
@Component
public class HabitoProducer {

    private final RabbitTemplate rabbitTemplate;

    // Exchange do RabbitMQ (fallback)
    @Value("${mindfocus.rabbitmq.exchange:mindfocus.event.exchange}")
    private String exchange;

    // Routing keys (fallbacks)
    @Value("${mindfocus.rabbitmq.routing-keys.habito:habito.internal}")
    private String habitoRoutingKey;

    // routing key para notificações
    @Value("${mindfocus.rabbitmq.routing-keys.notification:habito.criado}")
    private String notificationRoutingKey;

    @Value("${mindfocus.rabbitmq.routing-keys.audit:audit.log}")
    private String auditRoutingKey;

    @Value("${mindfocus.rabbitmq.routing-keys.schedule:schedule.check}")
    private String scheduleRoutingKey;

    /* Injeta RabbitTemplate e configura JSON converter */
    public HabitoProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        // configura conversor JSON
        this.rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
    }

    // Envia evento de criação no routing key interno
    public void enviarHabitoCriado(HabitoEvent habitoEvent) {
        try {
            // publica no routing key de hábito
            rabbitTemplate.convertAndSend(exchange, habitoRoutingKey, habitoEvent);
            System.out.println("Evento de hábito criado enviado com sucesso: " + habitoEvent +
                    " usando a chave de roteamento: " + habitoRoutingKey);
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