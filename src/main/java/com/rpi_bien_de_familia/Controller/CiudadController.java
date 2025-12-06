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

import com.rpi_bien_de_familia.Entity.Ciudad;
import com.rpi_bien_de_familia.Service.CiudadService;

@RestController
@RequestMapping("/api/ciudades")
public class CiudadController {

    private final CiudadService ciudadService;

    public CiudadController(CiudadService ciudadService) {
        this.ciudadService = ciudadService;
    }

    @GetMapping
    public List<Ciudad> listar() {
        return ciudadService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ciudad> buscarPorId(@PathVariable Long id) {
        Ciudad ciudad = ciudadService.buscarPorId(id);
        if (ciudad == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ciudad);
    }

    @PostMapping
    public ResponseEntity<Ciudad> crear(@RequestBody Ciudad ciudad) {
        ciudad.setId(null); 
        Ciudad nueva = ciudadService.guardar(ciudad);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ciudad> actualizar(@PathVariable Long id, @RequestBody Ciudad ciudad) {
        Ciudad ciudad_a_actualizar = ciudadService.buscarPorId(id);
        if (ciudad_a_actualizar == null) {
            return ResponseEntity.notFound().build();
        }
        ciudad_a_actualizar.setCodigo(ciudad.getCodigo());
        ciudad_a_actualizar.setDescripcion(ciudad.getDescripcion());
        ciudad_a_actualizar.setDepartamento(ciudad.getDepartamento());

        Ciudad ciudad_actualida = ciudadService.guardar(ciudad_a_actualizar);
        return ResponseEntity.ok(ciudad_actualida);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Ciudad ciudad = ciudadService.buscarPorId(id);
        if (ciudad == null) {
            return ResponseEntity.notFound().build();
        }

        ciudadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

