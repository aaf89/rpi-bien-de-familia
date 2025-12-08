package com.rpi_bien_de_familia.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rpi_bien_de_familia.Dto.InmuebleDTO;
import com.rpi_bien_de_familia.Entity.Inmueble;

public interface InmuebleRepository extends JpaRepository<Inmueble, Long>{
	Optional<Inmueble> findByMatricula(String matricula);
	
	boolean existsByMatricula(String matricula);

    boolean existsByNomenclaturaCatastral(String nomenclaturaCatastral);

    boolean existsByMatriculaAndIdNot(String matricula, Long id);

    boolean existsByNomenclaturaCatastralAndIdNot(String nomenclaturaCatastral, Long id);
    
    /*@Query("""
    	    SELECT new com.rpi_bien_de_familia.dto.InmuebleDTO(
    	        i,
    	        COUNT(pi)
    	    )
    	    FROM Inmueble i
    	    LEFT JOIN PersonaInmueble pi ON pi.inmueble.id = i.id
    	    GROUP BY i.id
    	    """)
    	List<InmuebleDTO> listarConCantidadTitulares();*/
}
