package com.rpi_bien_de_familia.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Entity.TipoParticipacion;
import com.rpi_bien_de_familia.Repository.TipoParticipacionRepository;

@Service
public class TipoParticipacionService {

    private final TipoParticipacionRepository tipoParticipacionRepository;

    public TipoParticipacionService(TipoParticipacionRepository tipoParticipacionRepository) {
        this.tipoParticipacionRepository = tipoParticipacionRepository;
    }

    public List<TipoParticipacion> listar() {
        return tipoParticipacionRepository.findAll();
    }

    public TipoParticipacion buscarPorId(Long id) {
        return tipoParticipacionRepository.findById(id).orElse(null);
    }

    public TipoParticipacion guardar(TipoParticipacion tipoParticipacion) {
        return tipoParticipacionRepository.save(tipoParticipacion);
    }

    public void eliminar(Long id) {
        tipoParticipacionRepository.deleteById(id);
    }
}
