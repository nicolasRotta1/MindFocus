package com.example.habito_service.repositories;

import com.example.habito_service.models.Habito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HabitoRepository extends JpaRepository<Habito, UUID>, JpaSpecificationExecutor<Habito> {

}
