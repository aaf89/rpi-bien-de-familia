package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Repository.InmuebleRepository;
import com.rpi_bien_de_familia.Entity.Inmueble;

@Service
public class InmuebleService {
	private final InmuebleRepository inmuebleRepository;
	
	public InmuebleService(InmuebleRepository inmuebleRepository) {
		this.inmuebleRepository=inmuebleRepository;
	}
	
	public List<Inmueble> listar(){
		return inmuebleRepository.findAll();
	}
	
	public Inmueble buscarPorId(Long id) {
		return inmuebleRepository.findById(id).orElse(null);
	}
	
	public Inmueble buscarPorMatricula(String matricula) {
		return inmuebleRepository.findByMatricula(matricula).orElse(null);
	}
	
	public Inmueble guardar(Inmueble inmueble) {
		return inmuebleRepository.save(inmueble);
	}
	
	public void eliminar(Long id) {
		inmuebleRepository.deleteById(id);
	}
}
