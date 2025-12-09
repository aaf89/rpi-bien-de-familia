package com.rpi_bien_de_familia.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rpi_bien_de_familia.Dto.PersonaDTO;
import com.rpi_bien_de_familia.Entity.Persona;
import com.rpi_bien_de_familia.Service.PersonaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {
	private final PersonaService personaService;
	
	public PersonaController(PersonaService personaService) {
		this.personaService=personaService;
	}
	
	@GetMapping
	public List<PersonaDTO> listar(){
		return personaService.listar();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Persona> buscarPorId(@PathVariable Long id) {
        Persona persona = personaService.buscarPorId(id);
        if (persona == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(persona);
    }
	
	@GetMapping("/cuit/{cuit}")
    public ResponseEntity<Persona> buscarPorCuit(@PathVariable String cuit) {
        Persona persona = personaService.buscarPorCuit(cuit);
        if (persona == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(persona);
    }
	
	@PostMapping
	public ResponseEntity<Persona> crear(@Valid @RequestBody Persona persona) {
	    Persona nueva = personaService.crearPersona(persona);
	    return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
	}
	
	@PutMapping("/{id}")
    public ResponseEntity<Persona> actualizar(@PathVariable Long id,
                                              @Valid @RequestBody Persona persona) {
        Persona personaActualizada = personaService.actualizarPersona(id, persona);
        return ResponseEntity.ok(personaActualizada);
    }

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
	    personaService.eliminar(id);
	    return ResponseEntity.noContent().build();
	}
}
