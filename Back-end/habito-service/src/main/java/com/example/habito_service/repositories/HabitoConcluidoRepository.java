package com.example.habito_service.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.habito_service.models.HabitoConcluido;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface HabitoConcluidoRepository extends JpaRepository<HabitoConcluido, UUID> {

    boolean existsByHabitoIdAndDate(UUID habitoId, LocalDate date);

    long countByHabitoId(UUID habitoId);

    long countByHabitoIdAndDateBetween(UUID habitoId, LocalDate from, LocalDate to);

    List<HabitoConcluido> findByHabitoIdAndDateBetweenOrderByDateAsc(UUID habitoId, LocalDate from, LocalDate to);

    List<HabitoConcluido> findByHabitoIdOrderByDateDesc(UUID habitoId);

    long countByHabitoUsuarioIdAndDate(UUID usuarioId, LocalDate date);

    long countByHabitoUsuarioIdAndDateBetween(UUID usuarioId, LocalDate from, LocalDate to);

    // Remove todos os registros de conclusão de um hábito em uma data e retorna quantos foram deletados
    @Modifying
    @Transactional
    @Query("DELETE FROM HabitoConcluido hc WHERE hc.habito.id = :habitoId AND hc.date = :date")
    long deleteByHabitoIdAndDate(@Param("habitoId") UUID habitoId, @Param("date") LocalDate date);

}

