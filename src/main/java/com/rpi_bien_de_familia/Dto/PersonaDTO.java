package com.rpi_bien_de_familia.Dto;

import com.rpi_bien_de_familia.Entity.Persona;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PersonaDTO {
    private Long id;
    private String cuit;
    private String apellido;
    private String nombre;
    private Long cantInmuebles;

    // constructor
    public PersonaDTO(Persona i, Long cantInmuebles) {
        this.id = i.getId();
        this.cuit = i.getCuit();
        this.apellido = i.getApellido();
        this.nombre = i.getNombre();
        this.cantInmuebles = cantInmuebles;
    }

}
