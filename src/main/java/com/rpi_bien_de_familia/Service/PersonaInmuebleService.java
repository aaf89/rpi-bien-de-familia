package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.Inmueble;
import com.rpi_bien_de_familia.Entity.Persona;
import com.rpi_bien_de_familia.Entity.PersonaInmueble;
import com.rpi_bien_de_familia.Repository.PersonaInmuebleRepository;

@Service
public class PersonaInmuebleService {

    private final PersonaInmuebleRepository personaInmuebleRepository;
    private final PersonaService personaService;
    private final InmuebleService inmuebleService;

    public PersonaInmuebleService(
            PersonaInmuebleRepository repo,
            PersonaService personaService,
            InmuebleService inmuebleService) {
        this.personaInmuebleRepository = repo;
        this.personaService = personaService;
        this.inmuebleService = inmuebleService;
    }
    
    public List<PersonaInmueble> listar() {
        return personaInmuebleRepository.findAll();
    }

    public PersonaInmueble buscarPorId(Long id) {
        return personaInmuebleRepository.findById(id).orElse(null);
    }

    public void crearTitularInicial(Long personaId, Long inmuebleId) {
    	Persona persona = personaService.buscarPorId(personaId);
    	Inmueble inmueble = inmuebleService.buscarPorId(inmuebleId);

        PersonaInmueble pi = new PersonaInmueble();
        pi.setPersona(persona);
        pi.setInmueble(inmueble);
        pi.setNumerador(1);
        pi.setDenominador(1); // 100%

        personaInmuebleRepository.save(pi);
    }
    
    public PersonaInmueble guardar(PersonaInmueble personaInmueble) {
    	Long idInmueble = personaInmueble.getInmueble().getId();
    	Integer cantTitulares = (int) personaInmuebleRepository.countByInmuebleId(idInmueble)+1;
    	
    	System.out.println("Cant Titulares " + cantTitulares);
    	if (cantTitulares > 1) {
    		recalcularPartes(idInmueble, cantTitulares);
    	}
    	
    	personaInmueble.setNumerador(1);
    	personaInmueble.setDenominador(cantTitulares);
        return personaInmuebleRepository.save(personaInmueble);
    }
    
    private void recalcularPartes(Long idInmueble, Integer cantTitulares) {
    	List<PersonaInmueble> titulares = personaInmuebleRepository.findByInmuebleId(idInmueble, cantTitulares);
    	
        for (PersonaInmueble pi : titulares) {
            pi.setNumerador(1);
            pi.setDenominador(cantTitulares);
        }

        personaInmuebleRepository.saveAll(titulares);
    }

    public void eliminar(Long id) {
        personaInmuebleRepository.deleteById(id);
    }
}
