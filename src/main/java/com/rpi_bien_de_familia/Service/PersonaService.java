package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.Persona;
import com.rpi_bien_de_familia.Repository.PersonaRepository;

@Service
public class PersonaService {
	private final PersonaRepository personaRepository;
	
	public PersonaService(PersonaRepository personaRepository) {
		this.personaRepository=personaRepository;
	}
	
	public List<Persona> listar(){
		return personaRepository.findAll();
	}
	
	public Persona buscarPorId(Long id) {
        return personaRepository.findById(id).orElse(null);
    }
	
	public Persona buscarPorCuit(String cuit) {
		return personaRepository.findByCuit(cuit).orElse(null);
	}

	public Persona guardar(Persona persona) {
		return personaRepository.save(persona);
	}
	
	public void eliminar(Long id) {
		personaRepository.deleteById(id);
	}
}
