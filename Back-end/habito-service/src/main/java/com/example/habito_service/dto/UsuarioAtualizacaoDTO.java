package com.example.habito_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UsuarioAtualizacaoDTO {

    @NotBlank(message = "O nome não pode estar em branco")
    @Size(min = 3, max = 80, message = "O nome deve ter entre 3 e 80 caracteres")
    private String nome;

    @NotBlank(message = "O email não pode estar em branco")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "O telefone não pode estar em branco")
    @Size(min = 10, max = 15, message = "O telefone deve ter entre 10 e 15 caracteres")
    private String telefone;

    public UsuarioAtualizacaoDTO() {}

    public UsuarioAtualizacaoDTO(String nome, String email, String telefone) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

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
