package com.example.notification_service.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notificacoes")
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false)
    private UUID usuarioId;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    @Column(nullable = false)
    private String tipo; // CRIADO, CONCLUIDO, ATUALIZADO, DELETADO

    @Column(nullable = false)
    private Boolean lida = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadaEm;

    // Construtores
    public Notificacao() {}

    public Notificacao(UUID usuarioId, String titulo, String mensagem, String tipo) {
        this.usuarioId = usuarioId;
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.tipo = tipo;
        this.lida = false;
    }

    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Boolean getLida() {
        return lida;
    }

    public void setLida(Boolean lida) {
        this.lida = lida;
    }

    public LocalDateTime getCriadaEm() {
        return criadaEm;
    }

    public void setCriadaEm(LocalDateTime criadaEm) {
        this.criadaEm = criadaEm;
    }

    @Override
    public String toString() {
        return "Notificacao{" +
                "id=" + id +
                ", usuarioId=" + usuarioId +
                ", titulo='" + titulo + '\'' +
                ", tipo='" + tipo + '\'' +
                ", lida=" + lida +
                ", criadaEm=" + criadaEm +
                '}';
    }
}
