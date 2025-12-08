package com.rpi_bien_de_familia.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Repository.InmuebleRepository;
import com.rpi_bien_de_familia.Repository.PersonaInmuebleRepository;
import com.rpi_bien_de_familia.Dto.InmuebleDTO;
import com.rpi_bien_de_familia.Entity.Inmueble;
import com.rpi_bien_de_familia.Exception.ValidacionNegocioException;

@Service
public class InmuebleService {
	private final InmuebleRepository inmuebleRepository;
	private final PersonaInmuebleRepository personaInmuebleRepository;
	
	public InmuebleService(InmuebleRepository inmuebleRepository, PersonaInmuebleRepository personaInmuebleRepository) {
		this.inmuebleRepository=inmuebleRepository;
		this.personaInmuebleRepository = personaInmuebleRepository;
	}
	
	public List<InmuebleDTO> listar() {
        List<Inmueble> inmuebles = inmuebleRepository.findAll();

        List<InmuebleDTO> dtos = new ArrayList<>();
        for (Inmueble i : inmuebles) {
            long cant = personaInmuebleRepository.countByInmuebleId(i.getId());
            dtos.add(new InmuebleDTO(i, cant));
        }

        return dtos;
    }
	
	public Inmueble buscarPorId(Long id) {
		return inmuebleRepository.findById(id).orElse(null);
	}
	
	public Inmueble buscarPorMatricula(String matricula) {
		return inmuebleRepository.findByMatricula(matricula).orElse(null);
	}
	
	public Inmueble crearInmueble(Inmueble inmueble) {

        if (inmuebleRepository.existsByMatricula(inmueble.getMatricula())) {
            throw new ValidacionNegocioException("Ya existe un inmueble con esa matrícula.");
        }

        if (inmuebleRepository.existsByNomenclaturaCatastral(inmueble.getNomenclaturaCatastral())) {
            throw new ValidacionNegocioException("Ya existe un inmueble con esa nomenclatura catastral.");
        }

        return inmuebleRepository.save(inmueble);
    }
	
	public Inmueble actualizarInmueble(Long id, Inmueble inmueble) {

        Inmueble existente = inmuebleRepository.findById(id)
                .orElseThrow(() -> new ValidacionNegocioException("El inmueble que intenta actualizar no existe."));

        if (inmuebleRepository.existsByMatriculaAndIdNot(inmueble.getMatricula(), id)) {
            throw new ValidacionNegocioException("Ya existe otro inmueble con esa matrícula.");
        }

        if (inmuebleRepository.existsByNomenclaturaCatastralAndIdNot(inmueble.getNomenclaturaCatastral(), id)) {
            throw new ValidacionNegocioException("Ya existe otro inmueble con esa nomenclatura catastral.");
        }

        existente.setMatricula(inmueble.getMatricula());
        existente.setNomenclaturaCatastral(inmueble.getNomenclaturaCatastral());
        existente.setCiudad(inmueble.getCiudad());

        return inmuebleRepository.save(existente);
    }
	
	public void eliminar(Long id) {
		inmuebleRepository.findById(id)
                .orElseThrow(() -> new ValidacionNegocioException("El inmueble que intenta eliminar no existe."));

		long cantTitulares = personaInmuebleRepository.countByInmuebleId(id);

		if (cantTitulares > 0) {
		    throw new ValidacionNegocioException(
		        "No se puede eliminar el inmueble, ya que tiene titulares asociados."
		    );
		}
		else {
			inmuebleRepository.deleteById(id);
		}
		
		
	}
}
