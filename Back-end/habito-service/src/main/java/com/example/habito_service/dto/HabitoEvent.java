package com.example.habito_service.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class HabitoEvent {
    private UUID habitoId;
    private String nome;
    private String userEmail;
    private UUID usuarioId;
    private String evento; // "CRIADO", "CONCLUIDO", "ATUALIZADO"
    private LocalDateTime timestamp;

    /**
     * Construtor vazio (default) - NECESSÁRIO para a deserialização do Jackson.
     */
    public HabitoEvent() {
    }

    // Construtor com todos os argumentos


    public HabitoEvent(UUID habitoId, String nome, String userEmail, UUID usuarioId, String evento, LocalDateTime timestamp) {
        this.habitoId = habitoId;
        this.nome = nome;
        this.userEmail = userEmail;
        this.usuarioId = usuarioId;
        this.evento = evento;
        this.timestamp = timestamp;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    // --- Getters e Setters (Omitidos para brevidade, mas devem estar presentes no arquivo completo) ---
    public UUID getHabitoId() {
        return habitoId;
    }

    public void setHabitoId(UUID habitoId) {
        this.habitoId = habitoId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getEvento() {
        return evento;
    }

    public void setEvento(String evento) {
        this.evento = evento;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "HabitoEvent{" +
                "habitoId=" + habitoId +
                ", nome='" + nome + '\'' +
                ", usuarioId=" + usuarioId +
                ", evento='" + evento + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}