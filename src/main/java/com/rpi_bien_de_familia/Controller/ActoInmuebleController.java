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

import com.rpi_bien_de_familia.Entity.ActoInmueble;
import com.rpi_bien_de_familia.Service.ActoInmuebleService;

@RestController
@RequestMapping("/api/actos-inmuebles")
@CrossOrigin(origins = "http://localhost:5173")
public class ActoInmuebleController {

    private final ActoInmuebleService actoInmuebleService;

    public ActoInmuebleController(ActoInmuebleService actoInmuebleService) {
        this.actoInmuebleService = actoInmuebleService;
    }

    @GetMapping
    public List<ActoInmueble> listar() {
        return actoInmuebleService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActoInmueble> obtener(@PathVariable Long id) {
        ActoInmueble acto = actoInmuebleService.buscarPorId(id);
        if (acto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(acto);
    }

    @PostMapping
    public ResponseEntity<ActoInmueble> crear(@RequestBody ActoInmueble actoInmueble) {
        actoInmueble.setId(null);
        ActoInmueble nuevo = actoInmuebleService.guardar(actoInmueble);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActoInmueble> actualizar(@PathVariable Long id,
                                                   @RequestBody ActoInmueble datos) {
        ActoInmueble existente = actoInmuebleService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        existente.setActoRegistral(datos.getActoRegistral());
        existente.setInmueble(datos.getInmueble());
        existente.setFechaDesde(datos.getFechaDesde());
        existente.setFechaHasta(datos.getFechaHasta());
        existente.setJuzgado(datos.getJuzgado());
        existente.setNumeroExpediente(datos.getNumeroExpediente());
        existente.setTomo(datos.getTomo());
        existente.setFolio(datos.getFolio());
        existente.setLibro(datos.getLibro());
        existente.setObservaciones(datos.getObservaciones());

        ActoInmueble actualizado = actoInmuebleService.guardar(existente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actoInmuebleService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

