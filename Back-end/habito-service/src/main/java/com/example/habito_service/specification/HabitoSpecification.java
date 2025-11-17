package com.example.habito_service.specification;

import com.example.habito_service.dto.HabitoRequest;
import com.example.habito_service.enums.TipoHabito;
import com.example.habito_service.models.Habito;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class HabitoSpecification {

    public static Specification<Habito> comFiltros(HabitoRequest filtro) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro por nome
            if (filtro.getNome() != null && !filtro.getNome().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("nome")),
                        "%" + filtro.getNome().toLowerCase() + "%"
                ));
            }

            // Filtro por tipo do hábito
            if (filtro.getTipo() != null) {
                predicates.add(criteriaBuilder.equal(root.get("tipo"), filtro.getTipo()));
            }

            // Filtro por status do hábito
            if (filtro.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filtro.getStatus()));
            }

            // Filtro por frequência do hábito
            if (filtro.getFrequencia() != null) {
                predicates.add(criteriaBuilder.equal(root.get("frequencia"), filtro.getFrequencia()));
            }

            // Filtro por conclusão
            if (filtro.getConcluido() != null) {
                predicates.add(criteriaBuilder.equal(root.get("concluido"), filtro.getConcluido()));
            }

            // Filtro por intervalo de datas de criação
            if (filtro.getDataInicio() != null && filtro.getDataFim() != null) {
                predicates.add(criteriaBuilder.between(root.get("dataCriacao"), filtro.getDataInicio(), filtro.getDataFim()));
            } else if (filtro.getDataInicio() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dataCriacao"), filtro.getDataInicio()));
            } else if (filtro.getDataFim() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dataCriacao"), filtro.getDataFim()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Métodos auxiliares para casos comuns
    public static Specification<Habito> porNome(String nome) {
        HabitoRequest filtro = new HabitoRequest();
        filtro.setNome(nome);
        return comFiltros(filtro);
    }

    public static Specification<Habito> porStatus(Boolean concluido) {
        HabitoRequest filtro = new HabitoRequest();
        filtro.setConcluido(concluido);
        return comFiltros(filtro);
    }

    public static Specification<Habito> porTipoEStatus(TipoHabito tipo, Boolean concluido) {
        HabitoRequest filtro = new HabitoRequest();
        filtro.setTipo(tipo);
        filtro.setConcluido(concluido);
        return comFiltros(filtro);
    }

    public static Specification<Habito> porDataBetween(LocalDateTime dataInicio, LocalDateTime dataFim) {
        HabitoRequest filtro = new HabitoRequest();
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return comFiltros(filtro);
    }

}
