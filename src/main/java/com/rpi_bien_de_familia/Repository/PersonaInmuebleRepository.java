package com.rpi_bien_de_familia.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rpi_bien_de_familia.Entity.PersonaInmueble;

public interface PersonaInmuebleRepository extends JpaRepository<PersonaInmueble, Long> {
    
    long countByInmuebleId(Long inmuebleId);
    long countByPersonaId(Long personaId);

    List<PersonaInmueble> findByInmuebleId(Long idInmueble, Integer cantTitulares);

}

