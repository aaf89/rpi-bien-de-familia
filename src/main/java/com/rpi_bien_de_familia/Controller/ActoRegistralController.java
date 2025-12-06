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

import com.rpi_bien_de_familia.Entity.ActoRegistral;
import com.rpi_bien_de_familia.Service.ActoRegistralService;

@RestController
@RequestMapping("/api/actos-registrales")
@CrossOrigin(origins = "http://localhost:5173")
public class ActoRegistralController {

    private final ActoRegistralService actoRegistralService;

    public ActoRegistralController(ActoRegistralService actoRegistralService) {
        this.actoRegistralService = actoRegistralService;
    }

    @GetMapping
    public List<ActoRegistral> listar() {
        return actoRegistralService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActoRegistral> obtener(@PathVariable Long id) {
        ActoRegistral acto = actoRegistralService.buscarPorId(id);
        if (acto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(acto);
    }

    @PostMapping
    public ResponseEntity<ActoRegistral> crear(@RequestBody ActoRegistral actoRegistral) {
        actoRegistral.setId(null);
        ActoRegistral nuevo = actoRegistralService.guardar(actoRegistral);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActoRegistral> actualizar(@PathVariable Long id,
                                                    @RequestBody ActoRegistral datos) {
        ActoRegistral existente = actoRegistralService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        existente.setDescripcion(datos.getDescripcion());
        ActoRegistral actualizado = actoRegistralService.guardar(existente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actoRegistralService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

