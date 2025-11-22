package com.example.habito_service.specification;

import com.example.habito_service.models.Habito;
import com.example.habito_service.enums.TipoHabito;
import com.example.habito_service.enums.StatusHabito;
import com.example.habito_service.enums.FrequenciaHabito;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class HabitoSpecification {

    public static Specification<Habito> comFiltros(
            String nome,
            TipoHabito tipo,
            StatusHabito status,
            FrequenciaHabito frequencia,
            Boolean concluido,
            LocalDateTime criadoEmInicio,
            LocalDateTime criadoEmFim,
            LocalDateTime atualizadoEmInicio,
            LocalDateTime atualizadoEmFim,
            UUID usuarioId
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtra somente hábitos do usuário logado
            if (usuarioId != null) {
                predicates.add(cb.equal(root.get("usuario").get("id"), usuarioId));
            }

            // Nome (LIKE)
            if (nome != null && !nome.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%"));
            }

            // Tipo
            if (tipo != null) {
                predicates.add(cb.equal(root.get("tipo"), tipo));
            }

            // Status
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            // Frequência
            if (frequencia != null) {
                predicates.add(cb.equal(root.get("frequencia"), frequencia));
            }

            // Concluído
            if (concluido != null) {
                predicates.add(cb.equal(root.get("concluido"), concluido));
            }

            // CriadoEm range
            if (criadoEmInicio != null && criadoEmFim != null) {
                predicates.add(cb.between(root.get("criadoEm"), criadoEmInicio, criadoEmFim));
            } else if (criadoEmInicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("criadoEm"), criadoEmInicio));
            } else if (criadoEmFim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("criadoEm"), criadoEmFim));
            }

            // AtualizadoEm range
            if (atualizadoEmInicio != null && atualizadoEmFim != null) {
                predicates.add(cb.between(root.get("atualizadoEm"), atualizadoEmInicio, atualizadoEmFim));
            } else if (atualizadoEmInicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("atualizadoEm"), atualizadoEmInicio));
            } else if (atualizadoEmFim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("atualizadoEm"), atualizadoEmFim));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
