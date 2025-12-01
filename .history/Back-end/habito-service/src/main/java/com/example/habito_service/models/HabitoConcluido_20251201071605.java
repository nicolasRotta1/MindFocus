package com.example.habito_service.models;


import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "habitos_concluidos", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"habito_id", "date"})
})
public class HabitoConcluido {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "habito_id", updatable = false, insertable = false)
    private UUID habitoId;

    @Column(name = "valor")
    private Double valor;

    public HabitoConcluido() {}

    public HabitoConcluido(Habito habito, LocalDate date) {
        this.habito = habito;
        this.date = date;
    }

    // getters / setters


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Habito getHabito() {
        return habito;
    }

    public void setHabito(Habito habito) {
        this.habito = habito;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public UUID getHabitoId() {
        return habitoId;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }
}
