package com.example.habito_service.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;

@Entity
public class HabitoConcluido {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Habito habito;

    private LocalDate date;
}
