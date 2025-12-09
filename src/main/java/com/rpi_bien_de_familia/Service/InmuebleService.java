package com.rpi_bien_de_familia.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Repository.ActoInmuebleRepository;
import com.rpi_bien_de_familia.Repository.CiudadRepository;
import com.rpi_bien_de_familia.Repository.InmuebleRepository;
import com.rpi_bien_de_familia.Repository.PersonaInmuebleRepository;
import com.rpi_bien_de_familia.Repository.PersonaRepository;
import com.rpi_bien_de_familia.Dto.CrearInmuebleRequest;
import com.rpi_bien_de_familia.Dto.InmuebleDTO;
import com.rpi_bien_de_familia.Entity.Ciudad;
import com.rpi_bien_de_familia.Entity.Inmueble;
import com.rpi_bien_de_familia.Entity.Persona;
import com.rpi_bien_de_familia.Entity.PersonaInmueble;
import com.rpi_bien_de_familia.Exception.ValidacionNegocioException;

@Service
public class InmuebleService {
	private final InmuebleRepository inmuebleRepository;
	private final ActoInmuebleRepository actoInmuebleRepository;
	private final PersonaInmuebleRepository personaInmuebleRepository;
	private final CiudadRepository ciudadRepository;
	private final PersonaRepository personaRepository;
	
	public InmuebleService(InmuebleRepository inmuebleRepository
						 , PersonaInmuebleRepository personaInmuebleRepository
						 , ActoInmuebleRepository actoInmuebleRepository
						 , PersonaRepository personaRepository
						 , CiudadRepository ciudadRepository) {
		this.inmuebleRepository=inmuebleRepository;
		this.personaInmuebleRepository = personaInmuebleRepository;
		this.actoInmuebleRepository = actoInmuebleRepository;
		this.ciudadRepository = ciudadRepository;
		this.personaRepository = personaRepository;
	}
	
	public List<InmuebleDTO> listar() {
        List<Inmueble> inmuebles = inmuebleRepository.findAll();
        long cant;
        boolean tieneBF;
        List<InmuebleDTO> dtos = new ArrayList<>();
        for (Inmueble i : inmuebles) {
            cant = personaInmuebleRepository.countByInmuebleId(i.getId());
            tieneBF = actoInmuebleRepository.existsByInmuebleIdAndActoRegistralIdAndFechaHastaIsNull(i.getId(), 1L); //1 Bien de Familia
            dtos.add(new InmuebleDTO(i, cant, tieneBF));
        }

        return dtos;
    }
	
	public Inmueble buscarPorId(Long id) {
		return inmuebleRepository.findById(id).orElse(null);
	}
	
	public Inmueble buscarPorMatricula(String matricula) {
		return inmuebleRepository.findByMatricula(matricula).orElse(null);
	}
	
	public Inmueble crearInmueble(CrearInmuebleRequest req) {
		if (inmuebleRepository.existsByMatricula(req.getMatricula())) {
            throw new ValidacionNegocioException("Ya existe un inmueble con esa matrícula.");
        }

        if (inmuebleRepository.existsByNomenclaturaCatastral(req.getNomenclaturaCatastral())) {
            throw new ValidacionNegocioException("Ya existe un inmueble con esa nomenclatura catastral.");
        }
        
        Inmueble nuevo = new Inmueble();
        nuevo.setMatricula(req.getMatricula());
        nuevo.setNomenclaturaCatastral(req.getNomenclaturaCatastral());

        if (req.getCiudadId() != null) {
            Ciudad ciudad = ciudadRepository.findById(req.getCiudadId())
                    .orElseThrow(() -> new ValidacionNegocioException("Ciudad inexistente"));
            nuevo.setCiudad(ciudad);
        }
		
        inmuebleRepository.save(nuevo);
        
        if (req.getPersonaId() != null) {
            Persona persona = personaRepository.findById(req.getPersonaId())
                    .orElseThrow(() -> new ValidacionNegocioException("Persona inexistente"));

            PersonaInmueble personaInmueble = new PersonaInmueble();
            personaInmueble.setPersona(persona);
            personaInmueble.setInmueble(nuevo);
            personaInmueble.setNumerador(1);
            personaInmueble.setDenominador(1);
            // si tenés tipoParticipacion por defecto, podés setearlo acá

            personaInmuebleRepository.save(personaInmueble);
        }
        
        return nuevo;
    }
	
	public Inmueble actualizarInmueble(Long id, CrearInmuebleRequest req) {

        Inmueble existente = inmuebleRepository.findById(id)
                .orElseThrow(() -> new ValidacionNegocioException("El inmueble que intenta actualizar no existe."));

        if (inmuebleRepository.existsByMatriculaAndIdNot(req.getMatricula(), id)) {
            throw new ValidacionNegocioException("Ya existe otro inmueble con esa matrícula.");
        }

        if (inmuebleRepository.existsByNomenclaturaCatastralAndIdNot(req.getNomenclaturaCatastral(), id)) {
            throw new ValidacionNegocioException("Ya existe otro inmueble con esa nomenclatura catastral.");
        }

        existente.setMatricula(req.getMatricula());
        existente.setNomenclaturaCatastral(req.getNomenclaturaCatastral());
        
        if (req.getCiudadId() != null) {
            Ciudad ciudad = ciudadRepository.findById(req.getCiudadId())
                    .orElseThrow(() -> new ValidacionNegocioException("Ciudad inexistente"));
            existente.setCiudad(ciudad);
        }

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
