package com.rpi_bien_de_familia.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rpi_bien_de_familia.Dto.BienFamiliaEstadisticaDTO;
import com.rpi_bien_de_familia.Entity.ActoInmueble;
import com.rpi_bien_de_familia.Entity.ActoInmueblePersona;
import com.rpi_bien_de_familia.Entity.PersonaInmueble;
import com.rpi_bien_de_familia.Entity.TipoParticipacion;
import com.rpi_bien_de_familia.Exception.ValidacionNegocioException;
import com.rpi_bien_de_familia.Repository.ActoInmueblePersonaRepository;
import com.rpi_bien_de_familia.Repository.ActoInmuebleRepository;
import com.rpi_bien_de_familia.Repository.PersonaInmuebleRepository;
import com.rpi_bien_de_familia.Repository.TipoParticipacionRepository;

@Service
public class ActoInmuebleService {

    private final ActoInmuebleRepository actoInmuebleRepository;
    private final PersonaInmuebleRepository personaInmuebleRepository;
    private final ActoInmueblePersonaRepository actoInmueblePersonaRepository;

    public ActoInmuebleService(ActoInmuebleRepository actoInmuebleRepository
    						, PersonaInmuebleRepository personaInmuebleRepository
    						, ActoInmueblePersonaRepository actoInmueblePersonaRepository
    						, TipoParticipacionRepository tipoParticipacionRepository
    						) {
        this.actoInmuebleRepository = actoInmuebleRepository;
        this.personaInmuebleRepository = personaInmuebleRepository;
        this.actoInmueblePersonaRepository = actoInmueblePersonaRepository;
    }

    public List<ActoInmueble> listar() {
        return actoInmuebleRepository.findAll();
    }

    public ActoInmueble buscarPorId(Long id) {
        return actoInmuebleRepository.findById(id).orElse(null);
    }

    public ActoInmueble guardar(ActoInmueble actoInmueble) {
    	Integer cantTitulares = (int) personaInmuebleRepository.countByInmuebleId(actoInmueble.getInmueble().getId());
    	        
    	// El inmueble debe tener al menos 1 titulares 
    	if (cantTitulares == 0) {
            throw new ValidacionNegocioException("El inmueble no tiene titulares");
    	};

        // El inmueble no debe ser un BF vigente (fecha_hasta = null)
    	Long inmuebleId = (Long) actoInmueble.getInmueble().getId();
    	Long actoRegistralId = actoInmueble.getActoRegistral().getId();
    	
    	boolean esAlta = actoInmueble.getId() == null;

    	if (esAlta) {
    	    if (actoInmuebleRepository
    	            .existsByInmuebleIdAndActoRegistralIdAndFechaHastaIsNull(
    	                inmuebleId, actoRegistralId)) {
    	        throw new ValidacionNegocioException("El inmueble ya es un Bien de Familia");
    	    } 
    	} else {
    	    if (actoInmuebleRepository
    	            .existsByInmuebleIdAndActoRegistralIdAndFechaHastaIsNullAndIdNot(
    	                inmuebleId, actoRegistralId, actoInmueble.getId())) {
    	        throw new ValidacionNegocioException("El inmueble ya es un Bien de Familia");
    	    }
    	}
    	
    	/*Los titulares no pueden tener otro inmueble como bien de familia*/
    	List<PersonaInmueble> titulares = personaInmuebleRepository.findByInmuebleId(inmuebleId, cantTitulares);
    	boolean yaTieneActoVigente = false;
    	for (PersonaInmueble titular : titulares) {
            yaTieneActoVigente =
                    actoInmueblePersonaRepository
                            .existsByPersonaInmueblePersonaIdAndActoInmuebleActoRegistralIdAndActoInmuebleFechaHastaIsNull(
                                    titular.getPersona().getId(),
                                    actoRegistralId
                            );

            if (yaTieneActoVigente) {
                String nombre = titular.getPersona().getApellido() + ", " + titular.getPersona().getNombre();
                throw new ValidacionNegocioException(
                        "La persona " + nombre + " ya registra un acto vigente de este tipo");
            }
        }
    	
    	// Guarda el ActoInmueble
    	ActoInmueble actoNuevo = actoInmuebleRepository.save(actoInmueble);

    	/* Crea automáticamente los ActoInmueblePersona para cada titular */
    	ActoInmueblePersona aip;
    	for (PersonaInmueble titular : titulares) {
    		aip = new ActoInmueblePersona();
            aip.setActoInmueble(actoNuevo);
            aip.setPersonaInmueble(titular);

            actoInmueblePersonaRepository.save(aip);
        }
    	   	
    	
    	return actoInmuebleRepository.save(actoInmueble);
    }

    public List<Object[]> obtenerEstadisticaAnioDepartamento() {
        return actoInmuebleRepository.obtenerEstadisticaAnioDepartamento();
    }
    
    public void eliminar(Long id) {
        actoInmuebleRepository.deleteById(id);
    }
}
