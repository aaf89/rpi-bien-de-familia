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

import com.rpi_bien_de_familia.Entity.ActoPersona;
import com.rpi_bien_de_familia.Service.ActoPersonaService;

@RestController
@RequestMapping("/api/actos-personas")
@CrossOrigin(origins = "http://localhost:5173")
public class ActoPersonaController {

    private final ActoPersonaService actoPersonaService;

    public ActoPersonaController(ActoPersonaService actoPersonaService) {
        this.actoPersonaService = actoPersonaService;
    }

    @GetMapping
    public List<ActoPersona> listar() {
        return actoPersonaService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActoPersona> obtener(@PathVariable Long id) {
        ActoPersona ap = actoPersonaService.buscarPorId(id);
        if (ap == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ap);
    }

    @PostMapping
    public ResponseEntity<ActoPersona> crear(@RequestBody ActoPersona actoPersona) {
        actoPersona.setId(null);
        ActoPersona nuevo = actoPersonaService.guardar(actoPersona);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActoPersona> actualizar(@PathVariable Long id,
                                                  @RequestBody ActoPersona datos) {
        ActoPersona existente = actoPersonaService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        existente.setActoInmueble(datos.getActoInmueble());
        existente.setPersona(datos.getPersona());
        existente.setTipoParticipacion(datos.getTipoParticipacion());

        ActoPersona actualizado = actoPersonaService.guardar(existente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actoPersonaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

