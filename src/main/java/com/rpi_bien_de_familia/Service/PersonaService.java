package com.rpi_bien_de_familia.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Dto.PersonaDTO;
import com.rpi_bien_de_familia.Entity.Persona;
import com.rpi_bien_de_familia.Exception.ValidacionNegocioException;
import com.rpi_bien_de_familia.Repository.PersonaInmuebleRepository;
import com.rpi_bien_de_familia.Repository.PersonaRepository;

@Service
public class PersonaService {
	private final PersonaRepository personaRepository;
	private final PersonaInmuebleRepository personaInmuebleRepository;
	
	public PersonaService(PersonaRepository personaRepository, PersonaInmuebleRepository personaInmuebleRepository) {
		this.personaRepository=personaRepository;
		this.personaInmuebleRepository = personaInmuebleRepository;
	}
	
	public List<PersonaDTO> listar() {
        List<Persona> personas = personaRepository.findAll();

        List<PersonaDTO> personasDTO = new ArrayList<>();
        for (Persona i : personas) {
            long cant = personaInmuebleRepository.countByPersonaId(i.getId());
            personasDTO.add(new PersonaDTO(i, cant));
        }

        return personasDTO;
    }
	
	public Persona buscarPorId(Long id) {
        return personaRepository.findById(id).orElse(null);
    }
	
	public Persona buscarPorCuit(String cuit) {
		return personaRepository.findByCuit(cuit).orElse(null);
	}

	public Persona crearPersona(Persona persona) {

        if (personaRepository.existsByCuit(persona.getCuit())) {
            throw new ValidacionNegocioException("Ya existe una persona con ese cuit.");
        }

        return personaRepository.save(persona);
    }
	
	public Persona actualizarPersona(Long id, Persona persona) {

		Persona existente = personaRepository.findById(id)
                .orElseThrow(() -> new ValidacionNegocioException("La persona que intenta actualizar no existe."));

        if (personaRepository.existsByCuitAndIdNot(persona.getCuit(), id)) {
            throw new ValidacionNegocioException("Ya existe otro persona con esa cuit.");
        }

        existente.setCuit(persona.getCuit());;
        existente.setApellido(persona.getApellido());
        existente.setNombre(persona.getNombre());

        return personaRepository.save(existente);
    }

	
	public void eliminar(Long id) {
		personaRepository.findById(id)
        .orElseThrow(() -> new ValidacionNegocioException(
                "La persona que intenta eliminar no existe."
        ));

		long cantInmuebles = personaInmuebleRepository.countByPersonaId(id);
		
		if (cantInmuebles > 0) {
		    throw new ValidacionNegocioException(
		        "No se puede eliminar la persona, ya que tiene inmuebles asociados."
		    );
		}
		personaRepository.deleteById(id);
	}
}
