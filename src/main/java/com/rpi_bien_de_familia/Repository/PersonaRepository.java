package com.rpi_bien_de_familia.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rpi_bien_de_familia.Entity.Persona;

public interface PersonaRepository extends JpaRepository<Persona, Long>{
    Optional<Persona> findByCuit(String cuit);
}
