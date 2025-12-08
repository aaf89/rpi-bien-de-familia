package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.ActoInmueblePersona;
import com.rpi_bien_de_familia.Repository.ActoInmueblePersonaRepository;

@Service
public class ActoInmueblePersonaService {

    private final ActoInmueblePersonaRepository actoInmueblePersonaRepository;

    public ActoInmueblePersonaService(ActoInmueblePersonaRepository actoPersonaRepository) {
        this.actoInmueblePersonaRepository = actoPersonaRepository;
    }

    public List<ActoInmueblePersona> listar() {
        return actoInmueblePersonaRepository.findAll();
    }

    public ActoInmueblePersona buscarPorId(Long id) {
        return actoInmueblePersonaRepository.findById(id).orElse(null);
    }

    public ActoInmueblePersona guardar(ActoInmueblePersona actoInmueblePersona) {
        return actoInmueblePersonaRepository.save(actoInmueblePersona);
    }

    public void eliminar(Long id) {
    	actoInmueblePersonaRepository.deleteById(id);
    }
}

