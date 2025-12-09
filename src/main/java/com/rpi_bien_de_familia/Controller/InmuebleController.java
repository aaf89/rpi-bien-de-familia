package com.rpi_bien_de_familia.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rpi_bien_de_familia.Dto.CrearInmuebleRequest;
import com.rpi_bien_de_familia.Dto.InmuebleDTO;
import com.rpi_bien_de_familia.Entity.Inmueble;
import com.rpi_bien_de_familia.Service.InmuebleService;
import com.rpi_bien_de_familia.Service.PersonaInmuebleService;

@RestController
@RequestMapping("/api/inmuebles")
@CrossOrigin(origins = "http://localhost:5173")   // <- AGREGÁ ESTO
public class InmuebleController {

    private final InmuebleService inmuebleService;
    private final PersonaInmuebleService personaInmuebleService;

    public InmuebleController(
            InmuebleService inmuebleService,
            PersonaInmuebleService personaInmuebleService
    ) {
        this.inmuebleService = inmuebleService;
        this.personaInmuebleService = personaInmuebleService;
    }

    @GetMapping
    public List<InmuebleDTO> listar() {
        return inmuebleService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inmueble> buscarPorId(@PathVariable Long id) {
        Inmueble inmueble = inmuebleService.buscarPorId(id);
        if (inmueble == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(inmueble);
    }

    @PostMapping
    public ResponseEntity<Inmueble> crear(@RequestBody CrearInmuebleRequest req) {
        Inmueble creado = inmuebleService.crearInmueble(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inmueble> actualizar(@PathVariable Long id,
    										   @RequestBody CrearInmuebleRequest req) {
        Inmueble actualizado = inmuebleService.actualizarInmueble(id, req);
        return ResponseEntity.ok(actualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        inmuebleService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

