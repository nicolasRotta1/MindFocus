package com.example.habito_service.security;

import com.example.habito_service.models.Usuario;
import com.example.habito_service.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrPhone) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(usernameOrPhone)
                .or(() -> usuarioRepository.findByTelefone(usernameOrPhone))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
}
