package com.rpi_bien_de_familia.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rpi_bien_de_familia.Entity.Departamento;

public interface DepartamentoRepository extends JpaRepository<Departamento, Long>{
}
