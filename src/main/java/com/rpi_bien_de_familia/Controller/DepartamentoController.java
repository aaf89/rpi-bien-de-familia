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

import com.rpi_bien_de_familia.Entity.Departamento;
import com.rpi_bien_de_familia.Service.DepartamentoService;

@RestController
@RequestMapping("/api/departamentos")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @GetMapping
    public List<Departamento> listar() {
        return departamentoService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departamento> buscarPorId(@PathVariable Long id) {
    	Departamento departamento = departamentoService.buscarPorId(id);
        if (departamento == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(departamento);
    }

    @PostMapping
    public ResponseEntity<Departamento> crear(@RequestBody Departamento departamento) {
    	departamento.setId(null); 
    	Departamento nuevo = departamentoService.guardar(departamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departamento> actualizar(@PathVariable Long id, @RequestBody Departamento departamento) {
    	Departamento departamento_a_actualizar = departamentoService.buscarPorId(id);
        if (departamento_a_actualizar == null) {
            return ResponseEntity.notFound().build();
        }
        departamento_a_actualizar.setCodigo(departamento.getCodigo());
        departamento_a_actualizar.setDescripcion(departamento.getDescripcion());

        Departamento departamento_actualizado = departamentoService.guardar(departamento_a_actualizar);
        return ResponseEntity.ok(departamento_actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Departamento departamento = departamentoService.buscarPorId(id);
        if (departamento == null) {
            return ResponseEntity.notFound().build();
        }

        departamentoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

