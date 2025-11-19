package com.example.habito_service.controllers;

import com.example.habito_service.models.Habito;
import com.example.habito_service.services.HabitoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/habitos")
public class HabitoController {

    private final HabitoService habitoService;

    public HabitoController(HabitoService habitoService) {
        this.habitoService = habitoService;
    }

    // ============================
    // Listar todos os hábitos do usuário logado
    // ============================
    @GetMapping
    public ResponseEntity<List<Habito>> listarHabitos() {
        List<Habito> habitos = habitoService.listarHabitosDoUsuario();
        return ResponseEntity.ok(habitos);
    }

    // ============================
    // Criar hábito
    // ============================
    @PostMapping
    public ResponseEntity<Habito> criarHabito(@Valid @RequestBody Habito habito) {
        Habito habitoCriado = habitoService.criarHabito(habito);
        return new ResponseEntity<>(habitoCriado, HttpStatus.CREATED);
    }

    // ============================
    // Buscar hábito por ID
    // ============================
    @GetMapping("/{id}")
    public ResponseEntity<Habito> buscarPorId(@PathVariable UUID id) {
        Habito habito = habitoService.buscarPorId(id);
        return ResponseEntity.ok(habito);
    }

    // ============================
    // Atualizar hábito
    // ============================
    @PutMapping("/{id}")
    public ResponseEntity<Habito> atualizarHabito(
            @PathVariable UUID id,
            @Valid @RequestBody Habito habitoAtualizado
    ) {
        Habito habito = habitoService.atualizarHabito(id, habitoAtualizado);
        return ResponseEntity.ok(habito);
    }

    // ============================
    // Deletar hábito
    // ============================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarHabito(@PathVariable UUID id) {
        habitoService.deletarHabito(id);
    }

    // ============================
    // Marcar hábito como concluído
    // ============================
    @PostMapping("/{id}/concluir")
    public ResponseEntity<Habito> concluirHabito(@PathVariable UUID id) {
        Habito habito = habitoService.concluirHabito(id);
        return ResponseEntity.ok(habito);
    }
}
