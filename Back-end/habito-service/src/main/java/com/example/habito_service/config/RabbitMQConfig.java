package com.example.habito_service.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange
    @Value("${mindfocus.rabbitmq.exchange}")
    private String exchangeName;

    // Queues
    @Value("${mindfocus.rabbitmq.queues.habito-events}")
    private String habitoQueue;

    @Value("${mindfocus.rabbitmq.queues.notification-events}")
    private String notificationQueue;

    @Value("${mindfocus.rabbitmq.queues.audit-events}")
    private String auditQueue;

    @Value("${mindfocus.rabbitmq.queues.schedule-events}")
    private String scheduleQueue;

    // Routing Keys
    @Value("${mindfocus.rabbitmq.routing-keys.habito}")
    private String habitoRoutingKey;

    @Value("${mindfocus.rabbitmq.routing-keys.notification}")
    private String notificationRoutingKey;

    @Value("${mindfocus.rabbitmq.routing-keys.audit}")
    private String auditRoutingKey;

    @Value("${mindfocus.rabbitmq.routing-keys.schedule}")
    private String scheduleRoutingKey;

    // --- Queues ---
    @Bean
    public Queue habitoEventsQueue() {
        return QueueBuilder.durable(habitoQueue).build();
    }

    @Bean
    public Queue notificationEventsQueue() {
        return QueueBuilder.durable(notificationQueue).build();
    }

    @Bean
    public Queue auditEventsQueue() {
        return QueueBuilder.durable(auditQueue).build();
    }

    @Bean
    public Queue scheduleEventsQueue() {
        return QueueBuilder.durable(scheduleQueue).build();
    }

    // --- Exchange ---
    @Bean
    public TopicExchange eventExchange() {
        return new TopicExchange(exchangeName, true, false);
    }

    // --- Bindings ---
    @Bean
    public Binding habitoBinding(Queue habitoEventsQueue, TopicExchange eventExchange) {
        return BindingBuilder.bind(habitoEventsQueue)
                .to(eventExchange)
                .with(habitoRoutingKey);
    }

    @Bean
    public Binding notificationBinding(Queue notificationEventsQueue, TopicExchange eventExchange) {
        return BindingBuilder.bind(notificationEventsQueue)
                .to(eventExchange)
                .with(notificationRoutingKey);
    }

    @Bean
    public Binding auditBinding(Queue auditEventsQueue, TopicExchange eventExchange) {
        return BindingBuilder.bind(auditEventsQueue)
                .to(eventExchange)
                .with(auditRoutingKey);
    }

    @Bean
    public Binding scheduleBinding(Queue scheduleEventsQueue, TopicExchange eventExchange) {
        return BindingBuilder.bind(scheduleEventsQueue)
                .to(eventExchange)
                .with(scheduleRoutingKey);
    }
}
