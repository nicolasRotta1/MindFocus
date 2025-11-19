package com.example.habito_service.services;



import com.example.habito_service.Exception.GlobalExceptionHandler;
import com.example.habito_service.Exception.InvalidCredentialsException;
import com.example.habito_service.Exception.TokenNotFoundException;
import com.example.habito_service.Exception.UserAlreadyExistsException;
import com.example.habito_service.dto.LoginRequest;
import com.example.habito_service.dto.RegisterRequest;
import com.example.habito_service.models.Usuario;
import com.example.habito_service.repositories.UsuarioRepository;
import com.example.habito_service.security.TokenBlacklistService;
import com.example.habito_service.security.TokenService;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    // ===============================
    // Registro
    // ===============================
    @Transactional
    public String register(RegisterRequest dto) {
        if (userExists(dto)) {
            throw new UserAlreadyExistsException("Usuário já cadastrado!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));

        usuarioRepository.save(usuario);
        return "Usuário registrado com sucesso!";
    }

    private boolean userExists(RegisterRequest dto) {
        boolean emailExists = dto.getEmail() != null && usuarioRepository.findByEmail(dto.getEmail()).isPresent();
        boolean telefoneExists = dto.getTelefone() != null && usuarioRepository.findByTelefone(dto.getTelefone()).isPresent();
        return emailExists || telefoneExists;
    }

    // ===============================
    // Login
    // ===============================
    public String login(LoginRequest loginRequest) {
        Optional<Usuario> usuarioOptional;
        String identificador = loginRequest.identificador();

        if (identificador.contains("@")) {
            usuarioOptional = usuarioRepository.findByEmail(identificador);
        } else {
            usuarioOptional = usuarioRepository.findByTelefone(identificador);
        }

        if (usuarioOptional.isEmpty() || !passwordEncoder.matches(loginRequest.senha(), usuarioOptional.get().getSenha())) {
            throw new InvalidCredentialsException("Credenciais inválidas!");
        }

        return tokenService.generateToken(usuarioOptional.get());
    }

    // ===============================
    // Logout
    // ===============================
    public String logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.add(token);
            return "Logout realizado com sucesso!";
        } else {
            throw new TokenNotFoundException("Token não encontrado ou inválido!");
        }
    }
}
