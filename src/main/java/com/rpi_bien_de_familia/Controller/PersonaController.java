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

import com.rpi_bien_de_familia.Entity.Persona;
import com.rpi_bien_de_familia.Service.PersonaService;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {
	private final PersonaService personaService;
	
	public PersonaController(PersonaService personaService) {
		this.personaService=personaService;
	}
	
	@GetMapping
	public List<Persona> listar(){
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
    public ResponseEntity<Persona> crear(@RequestBody Persona persona) {
		persona.setId(null); 
		Persona nueva = personaService.guardar(persona);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

	@PutMapping("/{id}")
	public ResponseEntity<Persona> actualizar(@PathVariable Long id, @RequestBody Persona persona){
		Persona persona_a_actualizar = personaService.buscarPorId(id);
		if(persona_a_actualizar == null) {
			return ResponseEntity.notFound().build();
		}
		
		persona_a_actualizar.setCuit(persona.getCuit());
		persona_a_actualizar.setApellido(persona.getApellido());
		persona_a_actualizar.setNombre(persona.getNombre());
		
		Persona persona_actualizada = personaService.guardar(persona_a_actualizar);
		return ResponseEntity.ok(persona_actualizada);
	}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Persona persona = personaService.buscarPorId(id);
        if (persona == null) {
            return ResponseEntity.notFound().build();
        }

        personaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
