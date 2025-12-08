package com.rpi_bien_de_familia.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rpi_bien_de_familia.Entity.ActoInmueblePersona;

public interface ActoInmueblePersonaRepository extends JpaRepository<ActoInmueblePersona, Long>{

	boolean existsByPersonaInmueblePersonaIdAndActoInmuebleActoRegistralIdAndActoInmuebleFechaHastaIsNull(
            Long personaId,
            Long actoRegistralId
    );
	
}
