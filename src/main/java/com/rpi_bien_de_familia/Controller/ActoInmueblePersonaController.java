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

import com.rpi_bien_de_familia.Entity.ActoInmueblePersona;
import com.rpi_bien_de_familia.Service.ActoInmueblePersonaService;

@RestController
@RequestMapping("/api/actos-inmuebles-personas")
@CrossOrigin(origins = "http://localhost:5173")
public class ActoInmueblePersonaController {

    private final ActoInmueblePersonaService actoInmueblePersonaService;

    public ActoInmueblePersonaController(ActoInmueblePersonaService actoInmueblePersonaService) {
        this.actoInmueblePersonaService = actoInmueblePersonaService;
    }

    @GetMapping
    public List<ActoInmueblePersona> listar() {
        return actoInmueblePersonaService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActoInmueblePersona> obtener(@PathVariable Long id) {
        ActoInmueblePersona ap = actoInmueblePersonaService.buscarPorId(id);
        if (ap == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ap);
    }

    @PostMapping
    public ResponseEntity<ActoInmueblePersona> crear(@RequestBody ActoInmueblePersona actoInmueblePersona) {
    	actoInmueblePersona.setId(null);
    	ActoInmueblePersona nuevo = actoInmueblePersonaService.guardar(actoInmueblePersona);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActoInmueblePersona> actualizar(@PathVariable Long id,
                                                  @RequestBody ActoInmueblePersona datos) {
    	ActoInmueblePersona existente = actoInmueblePersonaService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        existente.setActoInmueble(datos.getActoInmueble());
        existente.setPersona(datos.getPersona());
        existente.setTipoParticipacion(datos.getTipoParticipacion());

        ActoInmueblePersona actualizado = actoInmueblePersonaService.guardar(existente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
    	actoInmueblePersonaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

