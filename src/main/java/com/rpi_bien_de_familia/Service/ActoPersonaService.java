package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.ActoPersona;
import com.rpi_bien_de_familia.Repository.ActoPersonaRepository;

@Service
public class ActoPersonaService {

    private final ActoPersonaRepository actoPersonaRepository;

    public ActoPersonaService(ActoPersonaRepository actoPersonaRepository) {
        this.actoPersonaRepository = actoPersonaRepository;
    }

    public List<ActoPersona> listar() {
        return actoPersonaRepository.findAll();
    }

    public ActoPersona buscarPorId(Long id) {
        return actoPersonaRepository.findById(id).orElse(null);
    }

    public ActoPersona guardar(ActoPersona actoPersona) {
        return actoPersonaRepository.save(actoPersona);
    }

    public void eliminar(Long id) {
        actoPersonaRepository.deleteById(id);
    }
}

