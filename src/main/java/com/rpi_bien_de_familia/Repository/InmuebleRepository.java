package com.rpi_bien_de_familia.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rpi_bien_de_familia.Entity.Inmueble;

public interface InmuebleRepository extends JpaRepository<Inmueble, Long>{
	Optional<Inmueble> findByMatricula(String matricula);
}
