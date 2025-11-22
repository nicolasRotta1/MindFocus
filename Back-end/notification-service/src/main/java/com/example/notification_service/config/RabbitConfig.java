package com.example.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // NOME DO EXCHANGE COMPARTILHADO COM O SERVIÇO DE HÁBITO
    // CORRIGIDO: Adicionado valor fallback ':mindfocus.event.exchange'
    @Value("${mindfocus.rabbitmq.exchange:mindfocus.event.exchange}")
    private String exchangeName;

    // NOME DA FILA QUE ESTE SERVIÇO VAI OUVIR
    // CORRIGIDO: Adicionado valor fallback ':habito.criado.listener.queue'
    @Value("${mindfocus.rabbitmq.queues.listener-habito:habito.criado.listener.queue}")
    private String habitoListenerQueue;

    // CHAVE DE ROTEAMENTO PARA EVENTOS DE HÁBITO CRIADO
    // CORRIGIDO: Adicionado valor fallback ':habito.criado'
    @Value("${mindfocus.rabbitmq.routing-keys.habito-criado:habito.criado}")
    private String habitoCriadoRoutingKey;

    /**
     * 1. Define o conversor JSON (Jackson). Essencial para desserializar o DTO (HabitoEvent)
     * enviado como JSON pelo microsserviço de Hábito.
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * 2. Configura o RabbitTemplate com o conversor JSON.
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

    // --- Queues e Exchange ---

    /**
     * 3. Define a fila específica para ouvir eventos de Hábito.
     * Esta fila é exclusiva do Notification Service.
     */
    @Bean
    public Queue habitoCreatedListenerQueue() {
        // QueueBuilder.durable garante que a fila sobreviva ao restart do RabbitMQ.
        return QueueBuilder.durable(habitoListenerQueue).build();
    }

    /**
     * 4. Define o Exchange (Tópico) - o ponto central de roteamento de eventos.
     * Deve ser o mesmo nome usado pelo serviço de Hábito.
     */
    @Bean
    public TopicExchange eventExchange() {
        // Durable=true, AutoDelete=false
        return new TopicExchange(exchangeName, true, false);
    }

    /**
     * 5. Cria a ligação (Binding) entre a fila e o Exchange.
     * Isso garante que apenas as mensagens com a chave 'habito.criado' (usada no serviço
     * produtor) cheguem a esta fila de notificação.
     */
    @Bean
    public Binding habitoCreatedBinding(Queue habitoCreatedListenerQueue, TopicExchange eventExchange) {
        return BindingBuilder.bind(habitoCreatedListenerQueue)
                .to(eventExchange)
                .with(habitoCriadoRoutingKey);
    }

    /**
     * Configurações customizadas para o Listener.
     */
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter());
        factory.setConcurrentConsumers(3);
        factory.setMaxConcurrentConsumers(10);
        return factory;
    }
}