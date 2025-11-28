package com.example.habito_service.controllers;

import com.example.habito_service.models.HabitoConcluido;
import com.example.habito_service.services.HabitoConcluidoService;
import com.example.habito_service.repositories.HabitoRepository;
import com.example.habito_service.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

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
    public ResponseEntity<?> concluirHoje(@PathVariable UUID habitoId) {
        HabitoConcluido concluido = concluidoService.completeToday(habitoId);

        return ResponseEntity.ok(Map.of(
                "mensagem", "Hábito concluído hoje com sucesso!",
                "conclusaoId", concluido.getId(),
                "data", concluido.getDate().toString(),
                "streakAtual", concluidoService.calculateStreak(habitoId)
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
}
