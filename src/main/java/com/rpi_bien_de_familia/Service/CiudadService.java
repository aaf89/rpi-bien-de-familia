package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Repository.CiudadRepository;
import com.rpi_bien_de_familia.Entity.Ciudad;

@Service
public class CiudadService {
	private final CiudadRepository ciudadRepository;
	
	public CiudadService(CiudadRepository ciudadRepository) {
		this.ciudadRepository=ciudadRepository;
	}
	
	public List<Ciudad> listar(){
		return ciudadRepository.findAll();
	}
	 
	public Ciudad buscarPorId(Long id) {
		return ciudadRepository.findById(id).orElse(null);
	}
	
	public Ciudad guardar(Ciudad ciudad) {
		return ciudadRepository.save(ciudad);
	}
	
	public void eliminar(Long id) {
		ciudadRepository.deleteById(id);
	}
}
