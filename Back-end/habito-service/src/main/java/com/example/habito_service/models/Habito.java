package com.example.habito_service.models;

import com.example.habito_service.enums.FrequenciaHabito;
import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.enums.TipoHabito;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
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
    private TipoHabito tipo = TipoHabito.SIM_NAO;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private StatusHabito status = StatusHabito.PENDENTE;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private FrequenciaHabito frequencia = FrequenciaHabito.DIARIO;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    // Auditoria e timestamps
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    private LocalDateTime atualizadoEm;

    // Progresso do hábito (0-100%)
    @Column(nullable = false)
    private Integer progresso = 0;

    // Construtores
    public Habito() {

    }

    public Habito(String nome, Boolean concluido, TipoHabito tipo, StatusHabito status,
                  FrequenciaHabito frequencia, Usuario usuario) {
        this.nome = nome;
        this.concluido = concluido;
        this.tipo = tipo;
        this.status = status;
        this.frequencia = frequencia;
        this.usuario = usuario;
        this.progresso = concluido ? 100 : 0;
    }

    // Getters e Setters
    public UUID getId() { return id; }

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
        this.progresso = concluido ? 100 : 0;
        if(concluido) this.status = StatusHabito.CONCLUIDO;
        else if(this.status == StatusHabito.CONCLUIDO) this.status = StatusHabito.PENDENTE;
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
        this.concluido = status == StatusHabito.CONCLUIDO;
        this.progresso = this.concluido ? 100 : progresso;
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

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public Integer getProgresso() {
        return progresso;
    }

    public void setProgresso(Integer progresso) {
        this.progresso = progresso;
    }

    @Override
    public String toString() {
        return "Habito{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", concluido=" + concluido +
                ", tipo=" + tipo +
                ", status=" + status +
                ", frequencia=" + frequencia +
                ", progresso=" + progresso +
                ", criadoEm=" + criadoEm +
                ", atualizadoEm=" + atualizadoEm +
                '}';
    }
}
