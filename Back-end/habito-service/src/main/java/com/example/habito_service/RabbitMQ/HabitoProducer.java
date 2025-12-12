package com.example.habito_service.RabbitMQ;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.habito_service.dto.HabitoEvent;

/* Envia eventos de hábito para o RabbitMQ. */
@Component
public class HabitoProducer {

    private static final Logger logger = LoggerFactory.getLogger(HabitoProducer.class);

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
        this.rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
    }

    // Envia evento de criação no routing key interno
    public void enviarHabitoCriado(HabitoEvent habitoEvent) {
        try {
            rabbitTemplate.convertAndSend(exchange, habitoRoutingKey, habitoEvent);
            logger.info("Evento de hábito criado enviado com sucesso: {} usando a chave de roteamento: {}",
                    habitoEvent, habitoRoutingKey);
        } catch (Exception e) {
            logger.error("ERRO ao enviar mensagem para RabbitMQ", e);
        }
    }

    public void enviarNotificacao(HabitoEvent habitoEvent) {
        try {
            rabbitTemplate.convertAndSend(exchange, notificationRoutingKey, habitoEvent);
            logger.info("Notificação enviada com sucesso para o routing key: {}", notificationRoutingKey);
        } catch (Exception e) {
            logger.error("ERRO ao enviar notificação para RabbitMQ", e);
        }
    }

    public void enviarAuditEvent(HabitoEvent habitoEvent) {
        try {
            rabbitTemplate.convertAndSend(exchange, auditRoutingKey, habitoEvent);

            logger.info("Evento de auditoria enviado com sucesso para o routing key: {}", auditRoutingKey);
        } catch (Exception e) {
            logger.error("ERRO ao enviar evento de auditoria para RabbitMQ", e);
        }
    }

    public void enviarScheduleEvent(HabitoEvent habitoEvent) {
        try {
            rabbitTemplate.convertAndSend(exchange, scheduleRoutingKey, habitoEvent);
            logger.info("Evento de schedule enviado com sucesso para o routing key: {}", scheduleRoutingKey);
        } catch (Exception e) {
            logger.error("ERRO ao enviar evento de schedule para RabbitMQ", e);
        }
    }
}
