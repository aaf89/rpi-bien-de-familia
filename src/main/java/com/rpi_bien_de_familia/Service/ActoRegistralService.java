package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.ActoRegistral;
import com.rpi_bien_de_familia.Repository.ActoRegistralRepository;

@Service
public class ActoRegistralService {

    private final ActoRegistralRepository actoRegistralRepository;

    public ActoRegistralService(ActoRegistralRepository actoRegistralRepository) {
        this.actoRegistralRepository = actoRegistralRepository;
    }

    public List<ActoRegistral> listar() {
        return actoRegistralRepository.findAll();
    }

    public ActoRegistral buscarPorId(Long id) {
        return actoRegistralRepository.findById(id).orElse(null);
    }

    public ActoRegistral guardar(ActoRegistral actoRegistral) {
        return actoRegistralRepository.save(actoRegistral);
    }

    public void eliminar(Long id) {
        actoRegistralRepository.deleteById(id);
    }
}

