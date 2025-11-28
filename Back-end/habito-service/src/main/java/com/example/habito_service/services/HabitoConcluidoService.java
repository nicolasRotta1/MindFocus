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
    private final UsuarioService usuarioService;

    public HabitoConcluidoService(HabitoConcluidoRepository concluidoRepository,
                                  HabitoRepository habitoRepository,
                                  UsuarioService usuarioService) {
        this.concluidoRepository = concluidoRepository;
        this.habitoRepository = habitoRepository;
        this.usuarioService = usuarioService;
    }

    private Habito buscarHabitoDoUsuarioLogado(UUID habitoId) {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();
        return habitoRepository.findByIdAndUsuarioId(habitoId, usuarioId)
                .orElseThrow(() -> new NoSuchElementException("Hábito não encontrado ou não pertence ao usuário"));
    }

    @Transactional
    public HabitoConcluido completeToday(UUID habitoId) {
        Habito habito = buscarHabitoDoUsuarioLogado(habitoId);

        LocalDate today = LocalDate.now();
        boolean jaConcluidoHoje = concluidoRepository.existsByHabitoIdAndDate(habitoId, today);

        if (jaConcluidoHoje) {
            return concluidoRepository.findByHabitoIdAndDateBetweenOrderByDateAsc(habitoId, today, today)
                    .get(0); // já existe, retorna o existente
        }

        HabitoConcluido novo = new HabitoConcluido(habito, today);
        return concluidoRepository.save(novo);
    }

    public boolean isCompletedOn(UUID habitoId, LocalDate date) {
        buscarHabitoDoUsuarioLogado(habitoId); // só valida propriedade
        return concluidoRepository.existsByHabitoIdAndDate(habitoId, date);
    }

    public int calculateStreak(UUID habitoId) {
        buscarHabitoDoUsuarioLogado(habitoId); // valida dono

        List<HabitoConcluido> completions = concluidoRepository.findByHabitoIdOrderByDateDesc(habitoId);
        if (completions.isEmpty()) return 0;

        Set<LocalDate> datasConcluidas = completions.stream()
                .map(HabitoConcluido::getDate)
                .collect(Collectors.toSet());

        LocalDate dia = LocalDate.now();
        int streak = 0;

        while (datasConcluidas.contains(dia)) {
            streak++;
            dia = dia.minusDays(1);
        }

        return streak;
    }

    public long countCompletedBetween(UUID habitoId, LocalDate from, LocalDate to) {
        buscarHabitoDoUsuarioLogado(habitoId);
        return concluidoRepository.countByHabitoIdAndDateBetween(habitoId, from, to);
    }

    public List<LocalDate> getHistory(UUID habitoId, LocalDate from, LocalDate to) {
        buscarHabitoDoUsuarioLogado(habitoId);
        return concluidoRepository.findByHabitoIdAndDateBetweenOrderByDateAsc(habitoId, from, to)
                .stream()
                .map(HabitoConcluido::getDate)
                .collect(Collectors.toList());
    }

    public Map<String, Object> habitoStats(UUID habitoId) {
        Habito habito = buscarHabitoDoUsuarioLogado(habitoId); // valida dono + carrega entidade

        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = hoje.withDayOfMonth(1);

        int streak = calculateStreak(habitoId);
        boolean concluidoHoje = isCompletedOn(habitoId, hoje);
        long totalConclusoes = concluidoRepository.countByHabitoId(habitoId);
        long concluidasEsteMes = concluidoRepository.countByHabitoIdAndDateBetween(habitoId, inicioMes, hoje);
        List<LocalDate> historico = getHistory(habitoId, LocalDate.of(2020, 1, 1), hoje); // histórico completo

        Map<String, Object> stats = new HashMap<>();
        stats.put("habitoId", habitoId);
        stats.put("nomeHabito", habito.getNome());
        stats.put("streakAtual", streak);
        stats.put("concluidoHoje", concluidoHoje);
        stats.put("totalConclusoes", totalConclusoes);
        stats.put("concluidasEsteMes", concluidasEsteMes);
        stats.put("historico", historico);
        stats.put("dataConsulta", hoje.toString());

        return stats;
    }

    public long countCompletedTodayByUser() {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();
        return concluidoRepository.countByHabitoUsuarioIdAndDate(usuarioId, LocalDate.now());
    }

    public long countCompletedThisWeekByUser() {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();
        LocalDate hoje = LocalDate.now();
        LocalDate inicioSemana = hoje.minusDays(hoje.getDayOfWeek().getValue() - 1); // segunda
        return concluidoRepository.countByHabitoUsuarioIdAndDateBetween(usuarioId, inicioSemana, hoje);
    }

    public long countTotalHabitosByUser() {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();
        return habitoRepository.countByUsuarioId(usuarioId);
    }
}