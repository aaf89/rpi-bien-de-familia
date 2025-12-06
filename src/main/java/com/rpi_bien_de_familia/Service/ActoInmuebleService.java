package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.ActoInmueble;
import com.rpi_bien_de_familia.Repository.ActoInmuebleRepository;

@Service
public class ActoInmuebleService {

    private final ActoInmuebleRepository actoInmuebleRepository;

    public ActoInmuebleService(ActoInmuebleRepository actoInmuebleRepository) {
        this.actoInmuebleRepository = actoInmuebleRepository;
    }

    public List<ActoInmueble> listar() {
        return actoInmuebleRepository.findAll();
    }

    public ActoInmueble buscarPorId(Long id) {
        return actoInmuebleRepository.findById(id).orElse(null);
    }

    public ActoInmueble guardar(ActoInmueble actoInmueble) {
        return actoInmuebleRepository.save(actoInmueble);
    }

    public void eliminar(Long id) {
        actoInmuebleRepository.deleteById(id);
    }
}
