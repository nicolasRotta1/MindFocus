package com.example.habito_service;

import com.example.habito_service.config.TestHabitoProducerConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestHabitoProducerConfig.class)
class HabitoServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
