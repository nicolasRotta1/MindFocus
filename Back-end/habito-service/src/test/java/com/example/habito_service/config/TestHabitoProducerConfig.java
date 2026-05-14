package com.example.habito_service.config;

import com.example.habito_service.RabbitMQ.HabitoProducer;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

@TestConfiguration
@Profile("test")
public class TestHabitoProducerConfig {

	@Bean
	public HabitoProducer habitoProducer() {
		return Mockito.mock(HabitoProducer.class);
	}
}
