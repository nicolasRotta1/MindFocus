package com.example.habito_service.dto;

import com.example.habito_service.models.Usuario;

import java.util.UUID;

public class UsuarioResponse {
    private String nome;
    private String email;
    private String telefone;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        UsuarioResponse dto = new UsuarioResponse();
        dto.nome = usuario.getNome();
        dto.email = usuario.getEmail();
        dto.telefone = usuario.getTelefone();
        return dto;
    }

    // Getters e Setters

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
