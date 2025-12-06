package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.PersonaInmueble;
import com.rpi_bien_de_familia.Repository.PersonaInmuebleRepository;

@Service
public class PersonaInmuebleService {

    private final PersonaInmuebleRepository personaInmuebleRepository;

    public PersonaInmuebleService(PersonaInmuebleRepository personaInmuebleRepository) {
        this.personaInmuebleRepository = personaInmuebleRepository;
    }

    public List<PersonaInmueble> listar() {
        return personaInmuebleRepository.findAll();
    }

    public PersonaInmueble buscarPorId(Long id) {
        return personaInmuebleRepository.findById(id).orElse(null);
    }

    public PersonaInmueble guardar(PersonaInmueble personaInmueble) {
        return personaInmuebleRepository.save(personaInmueble);
    }

    public void eliminar(Long id) {
        personaInmuebleRepository.deleteById(id);
    }
}
