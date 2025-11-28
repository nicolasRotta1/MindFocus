package com.example.habito_service.services;

import com.example.habito_service.models.Habito;
import com.example.habito_service.models.HabitoConcluido;
import com.example.habito_service.repositories.HabitoConcluidoRepository;
import com.example.habito_service.repositories.HabitoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HabitoConcluidoService {

    private final HabitoConcluidoRepository concluidoRepository;
    private final HabitoRepository habitoRepository;

    public HabitoConcluidoService(
            HabitoConcluidoRepository concluidoRepository,
            HabitoRepository habitoRepository) {
        this.concluidoRepository = concluidoRepository;
        this.habitoRepository = habitoRepository;
    }

    @Transactional
    public HabitoConcluido completeToday(UUID habitoId) {
        Habito habito = habitoRepository.findById(habitoId)
                .orElseThrow(() -> new NoSuchElementException("Hábito não encontrado"));

        LocalDate today = LocalDate.now();
        boolean exists = concluidoRepository.existsByHabitoIdAndDate(habitoId, today);

        if (exists) {
            List<HabitoConcluido> list = concluidoRepository
                    .findByHabitoIdAndDateBetweenOrderByDateAsc(habitoId, today, today);

            return list.isEmpty() ? new HabitoConcluido(habito, today) : list.get(0);
        }

        HabitoConcluido hc = new HabitoConcluido(habito, today);
        return concluidoRepository.save(hc);
    }

    public boolean isCompletedOn(UUID habitoId, LocalDate date) {
        return concluidoRepository.existsByHabitoIdAndDate(habitoId, date);
    }

    public int calculateStreak(UUID habitoId) {
        List<HabitoConcluido> completions =
                concluidoRepository.findByHabitoIdOrderByDateDesc(habitoId);

        if (completions.isEmpty()) return 0;

        LocalDate checking = LocalDate.now();
        int streak = 0;

        Set<LocalDate> completedDates = completions.stream()
                .map(HabitoConcluido::getDate)
                .collect(Collectors.toSet());

        while (completedDates.contains(checking)) {
            streak++;
            checking = checking.minusDays(1);
        }

        return streak;
    }

    public long countCompletedBetween(UUID habitoId, LocalDate from, LocalDate to) {
        return concluidoRepository.countByHabitoIdAndDateBetween(habitoId, from, to);
    }

    public List<LocalDate> getHistory(UUID habitoId, LocalDate from, LocalDate to) {
        List<HabitoConcluido> list =
                concluidoRepository.findByHabitoIdAndDateBetweenOrderByDateAsc(habitoId, from, to);

        return list.stream().map(HabitoConcluido::getDate).collect(Collectors.toList());
    }

    public long countCompletedTodayByUser(UUID userId) {
        return concluidoRepository.countByHabitoUsuarioIdAndDate(userId, LocalDate.now());
    }

    public long countCompletedThisWeekByUser(UUID userId) {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1);
        return concluidoRepository.countByHabitoUsuarioIdAndDateBetween(userId, startOfWeek, now);
    }

    public Map<String, Object> habitoStats(UUID habitoId) {

        habitoRepository.findById(habitoId)
                .orElseThrow(() -> new NoSuchElementException("Hábito não encontrado"));

        LocalDate now = LocalDate.now();

        int streak = calculateStreak(habitoId);
        boolean doneToday = isCompletedOn(habitoId, now);
        long total = concluidoRepository.countByHabitoId(habitoId);

        LocalDate firstDayOfMonth = now.withDayOfMonth(1);
        long doneThisMonth = concluidoRepository.countByHabitoIdAndDateBetween(
                habitoId, firstDayOfMonth, now
        );

        List<LocalDate> history =
                getHistory(habitoId, LocalDate.of(2000, 1, 1), now);

        Map<String, Object> resp = new HashMap<>();
        resp.put("habitoId", habitoId);
        resp.put("totalConcluido", total);
        resp.put("concluidoHoje", doneToday);
        resp.put("streakAtual", streak);
        resp.put("concluidosEsteMes", doneThisMonth);
        resp.put("historico", history);
        resp.put("dataConsulta", now.toString());

        return resp;
    }
}
