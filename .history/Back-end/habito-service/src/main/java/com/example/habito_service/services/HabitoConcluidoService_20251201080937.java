package com.example.habito_service.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import com.example.habito_service.dto.ProgressHistoryDTO;
import com.example.habito_service.enums.TipoHabito;
import com.example.habito_service.models.Habito;
import com.example.habito_service.models.HabitoConcluido;
import com.example.habito_service.repositories.HabitoConcluidoRepository;
import com.example.habito_service.repositories.HabitoRepository;

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

    private final Logger logger = LoggerFactory.getLogger(HabitoConcluidoService.class);

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
            var existente = concluidoRepository.findByHabitoIdAndDateBetweenOrderByDateAsc(habitoId, today, today);
            if (!existente.isEmpty()) {
                return existente.get(0);
            }
        }

        HabitoConcluido novo = new HabitoConcluido(habito, today);
        HabitoConcluido salvo = concluidoRepository.save(novo);
        
        // Atualizar o Habito como concluído (para SIM_NAO)
        if (habito.getTipo() == TipoHabito.SIM_NAO) {
            habito.setConcluido(true);
            habitoRepository.save(habito);
        }
        
        return salvo;
    }

    public boolean isCompletedOn(UUID habitoId, LocalDate date) {
        // Carrega hábito para verificar tipo e meta
        Habito habito = buscarHabitoDoUsuarioLogado(habitoId);

        // Busca registros de conclusão naquele dia
        var registros = concluidoRepository.findByHabitoIdAndDateBetweenOrderByDateAsc(habitoId, date, date);
        if (registros == null || registros.isEmpty()) return false;

        // Sim/Não: qualquer registro indica conclusão
        if (habito.getTipo() == TipoHabito.SIM_NAO) return true;

        // Quantitativo: considerar concluído somente se valor registrado >= meta
        Double meta = habito.getMetaValor();
        Double valor = registros.get(0).getValor();
        if (meta != null && meta > 0 && valor != null) {
            return valor >= meta;
        }

        return false;
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
        // Contagem baseada em regra: para cada hábito do usuário, verifica conclusão válida hoje
        long count = 0;
        var habitos = habitoRepository.findByUsuarioId(usuarioId);
        for (Habito h : habitos) {
            if (isCompletedOn(h.getId(), LocalDate.now())) count++;
        }
        return count;
    }

    public long countCompletedThisWeekByUser() {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();
        LocalDate hoje = LocalDate.now();
        LocalDate inicioSemana = hoje.minusDays(hoje.getDayOfWeek().getValue() - 1); // segunda
        long count = 0;
        var habitos = habitoRepository.findByUsuarioId(usuarioId);
        for (Habito h : habitos) {
            // conta quantos dias do período o hábito foi validamente concluído
            LocalDate d = inicioSemana;
            while (!d.isAfter(hoje)) {
                if (isCompletedOn(h.getId(), d)) count++;
                d = d.plusDays(1);
            }
        }
        return count;
    }

    public long countTotalHabitosByUser() {
        UUID usuarioId = usuarioService.buscarUsuarioLogado().getId();
        return habitoRepository.countByUsuarioId(usuarioId);
    }

    public long countCompletedOnDateByUser(UUID usuarioId, LocalDate date) {
        long count = 0;
        var habitos = habitoRepository.findByUsuarioId(usuarioId);
        for (Habito h : habitos) {
            if (isCompletedOn(h.getId(), date)) count++;
        }
        return count;
    }

    @Transactional
    public HabitoConcluido completeToday(UUID habitoId, Double valor) {
        HabitoConcluido concluido = completeToday(habitoId);
        if (valor != null) {
            concluido.setValor(valor);
            return concluidoRepository.save(concluido);
        }
        return concluido;
    }

    @Transactional
    public void uncompleteToday(UUID habitoId) {
        Habito habito = buscarHabitoDoUsuarioLogado(habitoId);
        LocalDate today = LocalDate.now();
        // Remove explicitamente todos os registros de conclusão do dia diretamente no banco
        long deleted = concluidoRepository.deleteByHabitoIdAndDate(habitoId, today);
        if (deleted > 0) {
            logger.info("Removidos {} registros de conclusão para o hábito {} na data {}", deleted, habitoId, today);
            // garantir que as deleções sejam sincronizadas com o contexto
            concluidoRepository.flush();
        } else {
            logger.info("Nenhum registro de conclusão encontrado para o hábito {} na data {}", habitoId, today);
        }
        
        // Only update Habito if it's a SIM_NAO type
        // For other types, the cascade delete will handle it
        if (habito.getTipo() == TipoHabito.SIM_NAO && habito.getConcluido()) {
            habito.setConcluido(false);
            // Use a flush to ensure deletion is committed before the merge
            habitoRepository.flush();
            habitoRepository.save(habito);
        }
    }

    @Transactional
    public Habito updateProgress(UUID habitoId, Double valor) {
        Habito habito = buscarHabitoDoUsuarioLogado(habitoId);

        // SIM_NAO não usa progresso baseado em valor
        if (habito.getTipo() == TipoHabito.SIM_NAO) {
            return habito;
        }

        Double meta = habito.getMetaValor();
        int progresso = 0;
        if (meta != null && meta > 0 && valor != null) {
            progresso = (int) Math.min(100, Math.round((valor / meta) * 100));
        }

        habito.setProgresso(progresso);
        if (progresso == 100) habito.setConcluido(true);
        return habitoRepository.save(habito);
    }

    public List<ProgressHistoryDTO> getProgressHistory(UUID habitoId, LocalDate from, LocalDate to) {
        Habito habito = buscarHabitoDoUsuarioLogado(habitoId);
        List<HabitoConcluido> concluidoList = concluidoRepository.findByHabitoIdAndDateBetweenOrderByDateAsc(habitoId, from, to);
        Map<LocalDate, HabitoConcluido> mapa = concluidoList.stream()
                .collect(Collectors.toMap(HabitoConcluido::getDate, c -> c));

        List<ProgressHistoryDTO> history = new ArrayList<>();
        LocalDate dia = from;
        while (!dia.isAfter(to)) {
            HabitoConcluido c = mapa.get(dia);
            Integer progresso = 0;
            Double valor = null;
            if (c != null) {
                valor = c.getValor();
                if (habito.getTipo() == TipoHabito.SIM_NAO) {
                    progresso = 100;
                } else {
                    Double meta = habito.getMetaValor();
                    if (meta != null && meta > 0 && valor != null) {
                        progresso = (int) Math.min(100, Math.round((valor / meta) * 100));
                    }
                }
            }
            history.add(new ProgressHistoryDTO(dia, progresso, valor));
            dia = dia.plusDays(1);
        }

        return history;
    }
}