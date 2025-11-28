package com.example.habito_service.controllers;

import com.example.habito_service.dto.HabitoRequest;
import com.example.habito_service.dto.HabitoResponse;
import com.example.habito_service.enums.FrequenciaHabito;
import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.enums.TipoHabito;
import com.example.habito_service.models.Habito;
import com.example.habito_service.services.HabitoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    // Listar todos os hábitos do usuário logado (com filtros opcionais)
    // ============================
    @GetMapping
    public ResponseEntity<List<HabitoResponse>> listarHabitos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) TipoHabito tipo,
            @RequestParam(required = false) StatusHabito status,
            @RequestParam(required = false) FrequenciaHabito frequencia,
            @RequestParam(required = false) Boolean concluido,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime criadoEmInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime criadoEmFim,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime atualizadoEmInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime atualizadoEmFim
    ) {
        List<HabitoResponse> habitos = habitoService.listarHabitosDoUsuario(
                nome,
                tipo,
                status,
                frequencia,
                concluido,
                criadoEmInicio,
                criadoEmFim,
                atualizadoEmInicio,
                atualizadoEmFim
        );

        return ResponseEntity.ok(habitos);
    }


    // ============================
    // Criar hábito
    // ============================
    @PostMapping
    public ResponseEntity<HabitoResponse> criarHabito(@Valid @RequestBody HabitoRequest dto) {
        HabitoResponse habitoCriado = habitoService.criarHabito(dto);
        return new ResponseEntity<>(habitoCriado, HttpStatus.CREATED);
    }

    // ============================
    // Buscar hábito por ID
    // ============================
    @GetMapping("/{id}")
    public ResponseEntity<HabitoResponse> buscarPorId(@PathVariable UUID id) {
        Habito habito = habitoService.buscarPorId(id);
        return ResponseEntity.ok(HabitoResponse.fromEntity(habito));
    }


    // ============================
    // Atualizar hábito
    // ============================
    @PutMapping("/{id}")
    public ResponseEntity<HabitoResponse> atualizarHabito(
            @PathVariable UUID id,
            @Valid @RequestBody HabitoRequest dtoAtualizado
    ) {
        HabitoResponse habito = habitoService.atualizarHabito(id, dtoAtualizado);
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

}
