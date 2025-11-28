package com.example.notification_service.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para eventos de Hábito.
 * Cópia exata do DTO usado pelo microsserviço produtor (Habito Service).
 */
public class HabitoEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID habitoId;
    private String nome;
    private String userEmail;
    private UUID usuarioId;
    private String evento; // "CRIADO", "CONCLUIDO", "ATUALIZADO"
    private LocalDateTime timestamp;

    // Construtor padrão (NECESSÁRIO para desserialização JSON pelo Jackson)
    public HabitoEvent() {
    }

    public HabitoEvent(UUID habitoId, String nome, String userEmail, UUID usuarioId, String evento, LocalDateTime timestamp) {
        this.habitoId = habitoId;
        this.nome = nome;
        this.userEmail = userEmail;
        this.usuarioId = usuarioId;
        this.evento = evento;
        this.timestamp = timestamp;
    }

    // Getters e Setters
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
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