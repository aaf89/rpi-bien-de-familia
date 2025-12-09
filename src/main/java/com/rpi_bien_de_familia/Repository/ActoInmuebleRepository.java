package com.rpi_bien_de_familia.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.rpi_bien_de_familia.Dto.BienFamiliaEstadisticaDTO;


import com.rpi_bien_de_familia.Entity.ActoInmueble;

public interface ActoInmuebleRepository extends JpaRepository<ActoInmueble, Long>{

	boolean existsByInmuebleIdAndActoRegistralIdAndFechaHastaIsNull(Long inmuebleId, Long actoRegistralId);
	boolean existsByInmuebleIdAndActoRegistralIdAndFechaHastaIsNullAndIdNot(
		    Long inmuebleId,
		    Long actoRegistralId,
		    Long id
		);	
	@Query(value = """
	        SELECT 
	            strftime('%Y', ai.fecha_desde) AS anio,
	            d.descripcion                  AS departamento,
	            COUNT(*)                       AS cantidad
	        FROM actos_inmuebles ai
	        JOIN inmuebles i     ON i.id = ai.id_inmueble
	        JOIN ciudades c      ON c.id = i.id_ciudad
	        JOIN departamentos d ON d.id = c.id_departamento
	        WHERE ai.id_acto_registral = 1
	        GROUP BY anio, departamento
	        ORDER BY anio, departamento
	        """,
	        nativeQuery = true)
	    List<Object[]> obtenerEstadisticaAnioDepartamento();
}
