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

import com.rpi_bien_de_familia.Entity.Inmueble;
import com.rpi_bien_de_familia.Service.InmuebleService;

@RestController
@RequestMapping("/api/inmuebles")
@CrossOrigin(origins = "http://localhost:5173")   // <- AGREGÁ ESTO
public class InmuebleController {

    private final InmuebleService inmuebleService;

    public InmuebleController(InmuebleService inmuebleService) {
        this.inmuebleService = inmuebleService;
    }

    @GetMapping
    public List<Inmueble> listar() {
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
    public ResponseEntity<Inmueble> crear(@RequestBody Inmueble inmueble) {
        inmueble.setId(null); 
        Inmueble nuevo = inmuebleService.guardar(inmueble);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inmueble> actualizar(@PathVariable Long id, @RequestBody Inmueble inmueble) {
        Inmueble inmueble_a_actualizar = inmuebleService.buscarPorId(id);
        if (inmueble_a_actualizar == null) {
            return ResponseEntity.notFound().build();
        }
        inmueble_a_actualizar.setMatricula(inmueble.getMatricula());
        inmueble_a_actualizar.setNomenclaturaCatastral(inmueble.getNomenclaturaCatastral());

        Inmueble inmueble_actualizado = inmuebleService.guardar(inmueble_a_actualizar);
        return ResponseEntity.ok(inmueble_actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Inmueble inmueble = inmuebleService.buscarPorId(id);
        if (inmueble == null) {
            return ResponseEntity.notFound().build();
        }

        inmuebleService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

