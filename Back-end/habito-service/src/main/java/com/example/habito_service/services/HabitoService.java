package com.example.habito_service.services;

import com.example.habito_service.repositories.HabitoRepository;
import org.springframework.stereotype.Service;

@Service
public class HabitoService {

    private final HabitoRepository habitoRepository;

    public HabitoService(HabitoRepository habitoRepository) {
        this.habitoRepository = habitoRepository;
    }


}
