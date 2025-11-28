package com.example.habito_service.models;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "habitos_concluidos", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"habito_id", "date"})
})
public class HabitoConcluido {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habito_id", nullable = false)
    private Habito habito;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "habito_id", updatable = false, insertable = false)
    private UUID habitoId;

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
}
