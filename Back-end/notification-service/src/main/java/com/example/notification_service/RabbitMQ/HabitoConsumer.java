package com.example.notification_service.RabbitMQ;

import com.example.notification_service.dto.HabitoEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class HabitoConsumer {

    /**
     * CORREÇÃO:
     * 1. Usando a chave correta: mindfocus.rabbitmq.queues.listener-habito.
     * 2. Incluindo o valor fallback para evitar erros de inicialização.
     */
    @RabbitListener(queues = "${mindfocus.rabbitmq.queues.listener-habito:habito.criado.listener.queue}")
    public void receberEvento(HabitoEvent event) {
        System.out.println("----------------------------------------------");
        System.out.println("Notificação recebida: " + event.getEvento()
                + " para o hábito: " + event.getNome());
        System.out.println("----------------------------------------------");

        // Aqui você pode salvar em banco ou enviar email/push
    }
}