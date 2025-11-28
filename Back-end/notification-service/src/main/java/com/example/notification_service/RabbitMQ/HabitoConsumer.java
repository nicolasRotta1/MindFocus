package com.example.notification_service.RabbitMQ;

import com.example.notification_service.dto.HabitoEvent;
import com.example.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class HabitoConsumer {

    private static final Logger log = LoggerFactory.getLogger(HabitoConsumer.class);

    private final NotificationService notificationService;

    @Autowired
    public HabitoConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "${mindfocus.rabbitmq.queues.listener-habito:habito.criado.listener.queue}")
    public void receberEvento(HabitoEvent event) {
        try {
            log.info("Evento recebido: {}", event);
            notificationService.processarEvento(event);
        } catch (Exception e) {
            log.error("Erro ao processar evento: {}", event, e);
        }
    }
}