package com.example.habito_service.repositories;

import com.example.habito_service.models.HabitoConcluido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface HabitoConcluidoRepository extends JpaRepository<HabitoConcluido, UUID> {

    boolean existsByHabitoIdAndDate(UUID habitoId, LocalDate date);

    long countByHabitoId(UUID habitoId);

    long countByHabitoIdAndDateBetween(UUID habitoId, LocalDate from, LocalDate to);

    List<HabitoConcluido> findByHabitoIdAndDateBetweenOrderByDateAsc(UUID habitoId, LocalDate from, LocalDate to);

    List<HabitoConcluido> findByHabitoIdOrderByDateDesc(UUID habitoId);

    long countByHabitoUsuarioIdAndDate(UUID usuarioId, LocalDate date);

    long countByHabitoUsuarioIdAndDateBetween(UUID usuarioId, LocalDate from, LocalDate to);
}
