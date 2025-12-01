package com.example.habito_service.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.habito_service.models.HabitoConcluido;
import com.example.habito_service.repositories.HabitoRepository;
import com.example.habito_service.services.HabitoConcluidoService;
import com.example.habito_service.services.UsuarioService;

@RestController
@RequestMapping("/api/habitos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HabitoConcluidoController {

    private final HabitoConcluidoService concluidoService;
    private final HabitoRepository habitoRepository;
    private final UsuarioService usuarioService;

    public HabitoConcluidoController(HabitoConcluidoService concluidoService,
                                     HabitoRepository habitoRepository,
                                     UsuarioService usuarioService) {
        this.concluidoService = concluidoService;
        this.habitoRepository = habitoRepository;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/{habitoId}/concluir")
    public ResponseEntity<?> concluirHoje(@PathVariable UUID habitoId, @RequestParam(required = false) Double valor) {
        try {
            HabitoConcluido concluido = concluidoService.completeToday(habitoId, valor);

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Hábito concluído hoje com sucesso!",
                    "conclusaoId", concluido.getId(),
                    "data", concluido.getDate().toString(),
                    "valor", concluido.getValor(),
                    "streakAtual", concluidoService.calculateStreak(habitoId)
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of(
                    "mensagem", "Usuário não autenticado ou sessão inválida: " + e.getMessage()
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of(
                    "mensagem", "Hábito não encontrado: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "mensagem", "Erro ao concluir hábito: " + e.getMessage(),
                    "erro", e.getClass().getSimpleName()
            ));
        }
    }

    @PostMapping("/{habitoId}/desconcluir")
    public ResponseEntity<?> desconcluirHoje(@PathVariable UUID habitoId) {
        try {
            concluidoService.uncompleteToday(habitoId);

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Hábito desconcluído com sucesso!",
                    "habitoId", habitoId,
                    "streakAtual", concluidoService.calculateStreak(habitoId)
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of(
                    "mensagem", "Usuário não autenticado: " + e.getMessage()
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of(
                    "mensagem", "Hábito não encontrado: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "mensagem", "Erro ao desconcluir hábito: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{habitoId}/progresso")
    public ResponseEntity<?> atualizarProgresso(@PathVariable UUID habitoId, @RequestParam Double valor) {
        var habito = concluidoService.updateProgress(habitoId, valor);
        return ResponseEntity.ok(Map.of(
                "habitoId", habito.getId(),
                "progresso", habito.getProgresso(),
                "metaValor", habito.getMetaValor()
        ));
    }

    @GetMapping("/{habitoId}/concluido-hoje")
    public ResponseEntity<?> estaConcluidoHoje(@PathVariable UUID habitoId) {
        boolean concluidoHoje = concluidoService.isCompletedOn(habitoId, LocalDate.now());
        return ResponseEntity.ok(Map.of("concluidoHoje", concluidoHoje));
    }

    @GetMapping("/{habitoId}/stats")
    public ResponseEntity<Map<String, Object>> stats(@PathVariable UUID habitoId) {
        Map<String, Object> stats = concluidoService.habitoStats(habitoId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{habitoId}/historico")
    public ResponseEntity<?> historico(
            @PathVariable UUID habitoId,
            @RequestParam String de,
            @RequestParam String ate) {

        LocalDate inicio = LocalDate.parse(de);
        LocalDate fim = LocalDate.parse(ate);

        var datas = concluidoService.getHistory(habitoId, inicio, fim);
        return ResponseEntity.ok(Map.of(
                "habitoId", habitoId,
                "periodo", Map.of("de", de, "ate", ate),
                "datasConcluidas", datas
        ));
    }

    @GetMapping("/{habitoId}/historico-progresso")
    public ResponseEntity<?> historicoProgresso(
            @PathVariable UUID habitoId,
            @RequestParam String de,
            @RequestParam String ate) {

        LocalDate inicio = LocalDate.parse(de);
        LocalDate fim = LocalDate.parse(ate);

        var progressHistory = concluidoService.getProgressHistory(habitoId, inicio, fim);
        return ResponseEntity.ok(Map.of(
                "habitoId", habitoId,
                "periodo", Map.of("de", de, "ate", ate),
                "historico", progressHistory
        ));
    }

    // ============================================================
    // FINAL: ENDPOINT OFICIAL DO DASHBOARD POR USUÁRIO
    // ============================================================
    @GetMapping("/dashboard/usuario")
    public ResponseEntity<?> dashboardUsuario() {

        UUID userId = usuarioService.buscarUsuarioLogado().getId();

        long totalHabitos = habitoRepository.countByUsuarioId(userId);
        long concluidosHoje = concluidoService.countCompletedTodayByUser();
        long concluidosSemana = concluidoService.countCompletedThisWeekByUser();

        int percentualHoje = totalHabitos == 0 ? 0 :
                (int) ((concluidosHoje * 100.0) / totalHabitos);

        return ResponseEntity.ok(Map.of(
                "usuarioId", userId,
                "totalHabitos", totalHabitos,
                "concluidosHoje", concluidosHoje,
                "concluidosSemana", concluidosSemana,
                "percentualHoje", percentualHoje,
                "dataConsulta", LocalDate.now().toString()
        ));
    }

    // ============================================================
    // ENDPOINT: OVERVIEW (alternativa)
    // ============================================================
    @GetMapping("/dashboard/overview")
    public ResponseEntity<?> dashboardOverview() {

        UUID userId = usuarioService.buscarUsuarioLogado().getId();

        long totalHabitos = habitoRepository.countByUsuarioId(userId);
        long concluidosHoje = concluidoService.countCompletedTodayByUser();
        long concluidosSemana = concluidoService.countCompletedThisWeekByUser();

        int percentualHoje = totalHabitos == 0 ? 0 :
                (int) ((concluidosHoje * 100.0) / totalHabitos);

        return ResponseEntity.ok(Map.of(
                "usuarioId", userId,
                "totalHabitos", totalHabitos,
                "concluidosHoje", concluidosHoje,
                "concluidosSemana", concluidosSemana,
                "percentualHoje", percentualHoje,
                "dataConsulta", LocalDate.now().toString()
        ));
    }

    @GetMapping("/dashboard/historico")
    public ResponseEntity<?> dashboardHistorico(
            @RequestParam String de,
            @RequestParam String ate) {

        UUID userId = usuarioService.buscarUsuarioLogado().getId();

        LocalDate inicio = LocalDate.parse(de);
        LocalDate fim = LocalDate.parse(ate);

        long totalHabitos = habitoRepository.countByUsuarioId(userId);

        List<Map<String, Object>> dias = new java.util.ArrayList<>();

        LocalDate dia = inicio;
        while (!dia.isAfter(fim)) {
            long concluidos = concluidoService.countCompletedOnDateByUser(userId, dia);
            int percentual = totalHabitos == 0 ? 0 : (int) Math.round((concluidos * 100.0) / totalHabitos);

            dias.add(Map.of(
                    "data", dia.toString(),
                    "concluidos", concluidos,
                    "totalHabitos", totalHabitos,
                    "percentual", percentual
            ));

            dia = dia.plusDays(1);
        }

        return ResponseEntity.ok(Map.of(
                "periodo", Map.of("de", de, "ate", ate),
                "historico", dias
        ));
    }
}
