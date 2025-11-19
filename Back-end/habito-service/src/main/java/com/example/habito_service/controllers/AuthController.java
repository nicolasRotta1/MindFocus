package com.example.habito_service.controllers;

import com.example.habito_service.dto.AuthResponse;
import com.example.habito_service.dto.LoginRequest;
import com.example.habito_service.dto.RegisterRequest;
import com.example.habito_service.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ===============================
    // Registro
    // ===============================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest dto) {
        try {
            if (!dto.isValid()) {
                return ResponseEntity.badRequest().body("Preencha email ou telefone para registrar!");
            }
            String mensagem = authService.register(dto);
            return ResponseEntity.ok(mensagem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ===============================
    // Login
    // ===============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authService.login(loginRequest);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ===============================
    // Logout
    // ===============================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            String mensagem = authService.logout(authHeader);
            return ResponseEntity.ok(mensagem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
