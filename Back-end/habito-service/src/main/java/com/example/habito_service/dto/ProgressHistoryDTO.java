package com.example.habito_service.dto;

import java.time.LocalDate;

public class ProgressHistoryDTO {
    private LocalDate data;
    private Integer progresso; // 0-100%
    private Double valor; // valor registrado naquele dia (se aplicável)

    public ProgressHistoryDTO() {
    }

    public ProgressHistoryDTO(LocalDate data, Integer progresso, Double valor) {
        this.data = data;
        this.progresso = progresso;
        this.valor = valor;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Integer getProgresso() {
        return progresso;
    }

    public void setProgresso(Integer progresso) {
        this.progresso = progresso;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }
}
