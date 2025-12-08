package com.rpi_bien_de_familia.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rpi_bien_de_familia.Entity.PersonaInmueble;
import com.rpi_bien_de_familia.Service.PersonaInmuebleService;

import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/personas-inmuebles")
@CrossOrigin(origins = "http://localhost:5173")
public class PersonaInmuebleController {

    private final PersonaInmuebleService personaInmuebleService;

    public PersonaInmuebleController(PersonaInmuebleService personaInmuebleService) {
        this.personaInmuebleService = personaInmuebleService;
    }

    @GetMapping
    public List<PersonaInmueble> listar() {
        List<PersonaInmueble> lista = personaInmuebleService.listar();
        System.out.println("LISTA EN CONTROLLER = " + lista);
        return lista;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonaInmueble> obtener(@PathVariable Long id) {
        PersonaInmueble pi = personaInmuebleService.buscarPorId(id);
        if (pi == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pi);
    }

    @PostMapping
    public ResponseEntity<PersonaInmueble> crear(@RequestBody PersonaInmueble personaInmueble) {
    	/*try {
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("\n\n=== DD DEBUG PERSONA_INMUEBLE ===");
            System.out.println(mapper.writeValueAsString(personaInmueble));
            System.out.println("=================================\n\n");
        } catch (Exception e) {
            e.printStackTrace();
        }

        throw new RuntimeException("CORTADO ADREDE POR DD");*/
        personaInmueble.setId(null);
        
        PersonaInmueble nuevo = personaInmuebleService.guardar(personaInmueble);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonaInmueble> actualizar(@PathVariable Long id,
                                                      @RequestBody PersonaInmueble datos) {
        PersonaInmueble existente = personaInmuebleService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        existente.setPersona(datos.getPersona());
        existente.setInmueble(datos.getInmueble());
        existente.setNumerador(datos.getNumerador());
        existente.setDenominador(datos.getDenominador());
        PersonaInmueble actualizado = personaInmuebleService.guardar(existente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        personaInmuebleService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
