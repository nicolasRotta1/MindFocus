package com.example.habito_service.dto;

import com.example.habito_service.enums.FrequenciaHabito;
import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.enums.TipoHabito;
import com.example.habito_service.models.Habito;

import java.time.LocalDateTime;
import java.util.UUID;

public class HabitoResponse {
    private UUID id;
    private String nome;
    private Boolean concluido;
    private Integer progresso;
    private StatusHabito status;
    private TipoHabito tipo;
    private FrequenciaHabito frequencia;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public static HabitoResponse fromEntity(Habito habito) {
        HabitoResponse dto = new HabitoResponse();
        dto.id = habito.getId();
        dto.nome = habito.getNome();
        dto.concluido = habito.getConcluido();
        dto.progresso = habito.getProgresso();
        dto.status = habito.getStatus();
        dto.tipo = habito.getTipo();
        dto.frequencia = habito.getFrequencia();
        dto.criadoEm = habito.getCriadoEm();
        dto.atualizadoEm = habito.getAtualizadoEm();
        return dto;
    }


    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public Integer getProgresso() {
        return progresso;
    }

    public void setProgresso(Integer progresso) {
        this.progresso = progresso;
    }

    public StatusHabito getStatus() {
        return status;
    }

    public void setStatus(StatusHabito status) {
        this.status = status;
    }

    public TipoHabito getTipo() {
        return tipo;
    }

    public void setTipo(TipoHabito tipo) {
        this.tipo = tipo;
    }

    public FrequenciaHabito getFrequencia() {
        return frequencia;
    }

    public void setFrequencia(FrequenciaHabito frequencia) {
        this.frequencia = frequencia;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}
