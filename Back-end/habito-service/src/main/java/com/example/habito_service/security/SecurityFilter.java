package com.example.habito_service.security;

import com.example.habito_service.models.Usuario;
import com.example.habito_service.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;
    private final TokenBlacklistService tokenBlacklistService;

    public SecurityFilter(
            TokenService tokenService,
            UsuarioRepository usuarioRepository,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = recoverToken(request);

        if (token != null) {

            // Verifica se o token foi revogado (logout)
            if (tokenBlacklistService.isBlacklisted(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // ValidateToken agora retorna o SUBJECT → que é o UUID
            String subjectId = tokenService.validateToken(token);

            if (subjectId != null && !subjectId.isBlank()) {

                try {
                    UUID userId = UUID.fromString(subjectId);

                    Optional<Usuario> usuarioOpt = usuarioRepository.findById(userId);

                    if (usuarioOpt.isPresent()) {

                        Usuario usuario = usuarioOpt.get();

                        var authentication = new UsernamePasswordAuthenticationToken(
                                usuario.getId(),
                                null,
                                usuario.getAuthorities()
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                    }

                } catch (IllegalArgumentException e) {
                    // Caso o subject não seja um UUID válido
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}
