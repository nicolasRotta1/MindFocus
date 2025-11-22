package com.example.habito_service.dto;

import com.example.habito_service.enums.FrequenciaHabito;
import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.enums.TipoHabito;
import com.example.habito_service.models.Habito;
import com.example.habito_service.models.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class HabitoRequest {

    @NotBlank(message = "O nome do hábito é obrigatório")
    private String nome;

    @NotNull
    private TipoHabito tipo = TipoHabito.SIM_NAO;

    @NotNull
    private StatusHabito status = StatusHabito.PENDENTE;

    @NotNull
    private FrequenciaHabito frequencia = FrequenciaHabito.DIARIO;

    private Boolean concluido = false;
    private Integer progresso = 0;

    public Habito toEntity(Usuario usuario) {
        Habito habito = new Habito();
        habito.setNome(this.nome);
        habito.setTipo(this.tipo);
        habito.setFrequencia(this.frequencia);
        habito.setConcluido(this.concluido != null ? this.concluido : false);
        habito.setProgresso(this.progresso != null ? this.progresso : 0);

        // Define status corretamente baseado no "concluido"
        if (Boolean.TRUE.equals(this.concluido)) {
            habito.setStatus(StatusHabito.CONCLUIDO);
            habito.setProgresso(100);
        } else {
            habito.setStatus(this.status != null ? this.status : StatusHabito.PENDENTE);
        }

        habito.setUsuario(usuario);

        // Datas
        habito.setCriadoEm(LocalDateTime.now());
        habito.setAtualizadoEm(LocalDateTime.now());

        return habito;
    }


    // Getters e Setters

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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


}
