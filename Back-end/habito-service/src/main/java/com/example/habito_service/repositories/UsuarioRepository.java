package com.example.habito_service.repositories;

import com.example.habito_service.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    // Busca usuário por e-mail
    Optional<Usuario> findByEmail(String email);

    // Busca usuário por telefone
    Optional<Usuario> findByTelefone(String telefone);
}
