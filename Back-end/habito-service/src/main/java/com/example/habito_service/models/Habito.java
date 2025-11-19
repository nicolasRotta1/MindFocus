package com.example.habito_service.models;

import com.example.habito_service.enums.FrequenciaHabito;
import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.enums.TipoHabito;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Entity
@Table(name = "habitos")
public class Habito {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @NotBlank(message = "O nome do hábito não pode estar em branco")
    @Column(nullable = false)
    private String nome;

    @NotNull
    @Column(nullable = false)
    private Boolean concluido = false; // valor padrão ao criar

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private TipoHabito tipo = TipoHabito.SIM_NAO; // padrão

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private StatusHabito status = StatusHabito.PENDENTE; // padrão

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private FrequenciaHabito frequencia = FrequenciaHabito.DIARIO; // padrão

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false) // Define o nome da coluna de chave estrangeira
    @JsonIgnore // Evita loop infinito no Json
    private Usuario usuario;

    // Construtores

    public Habito() {}

    public Habito(String nome, Boolean concluido, TipoHabito tipo, StatusHabito status, FrequenciaHabito frequencia, Usuario usuario) {
        this.nome = nome;
        this.concluido = concluido;
        this.tipo = tipo;
        this.status = status;
        this.frequencia = frequencia;
        this.usuario = usuario;
    }

    // Getters e Setters

    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Boolean getConcluido() {
        return concluido;
    }

    public void setConcluido(Boolean concluido) {
        this.concluido = concluido;
    }

    public TipoHabito getTipo() {
        return tipo;
    }

    public void setTipo(TipoHabito tipo) {
        this.tipo = tipo;
    }

    public StatusHabito getStatus() {
        return status;
    }

    public void setStatus(StatusHabito status) {
        this.status = status;
    }

    public FrequenciaHabito getFrequencia() {
        return frequencia;
    }

    public void setFrequencia(FrequenciaHabito frequencia) {
        this.frequencia = frequencia;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    //toString

    @Override
    public String toString() {
        return "Habito{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", concluido=" + concluido +
                ", tipo=" + tipo +
                ", status=" + status +
                ", frequencia=" + frequencia +
                '}';
    }
}
