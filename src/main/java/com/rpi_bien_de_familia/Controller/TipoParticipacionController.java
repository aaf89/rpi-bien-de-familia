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

import com.rpi_bien_de_familia.Entity.TipoParticipacion;
import com.rpi_bien_de_familia.Service.TipoParticipacionService;

@RestController
@RequestMapping("/api/tipos-participaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class TipoParticipacionController {

    private final TipoParticipacionService tipoParticipacionService;

    public TipoParticipacionController(TipoParticipacionService tipoParticipacionService) {
        this.tipoParticipacionService = tipoParticipacionService;
    }

    @GetMapping
    public List<TipoParticipacion> listar() {
        return tipoParticipacionService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoParticipacion> obtener(@PathVariable Long id) {
        TipoParticipacion tipo = tipoParticipacionService.buscarPorId(id);
        if (tipo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tipo);
    }

    @PostMapping
    public ResponseEntity<TipoParticipacion> crear(@RequestBody TipoParticipacion tipoParticipacion) {
        tipoParticipacion.setId(null);
        TipoParticipacion nuevo = tipoParticipacionService.guardar(tipoParticipacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoParticipacion> actualizar(@PathVariable Long id,
                                                        @RequestBody TipoParticipacion datos) {
        TipoParticipacion existente = tipoParticipacionService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        existente.setDescripcion(datos.getDescripcion());
        TipoParticipacion actualizado = tipoParticipacionService.guardar(existente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tipoParticipacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
