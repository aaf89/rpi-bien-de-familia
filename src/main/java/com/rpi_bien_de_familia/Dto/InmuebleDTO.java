package com.rpi_bien_de_familia.Dto;

import com.rpi_bien_de_familia.Entity.Ciudad;
import com.rpi_bien_de_familia.Entity.Inmueble;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class InmuebleDTO {
    private Long id;
    private String matricula;
    private String nomenclaturaCatastral;
    private Ciudad ciudad;
    private Long cantTitulares;

    public InmuebleDTO(Inmueble i, Long cantTitulares) {
        this.id = i.getId();
        this.matricula = i.getMatricula();
        this.nomenclaturaCatastral = i.getNomenclaturaCatastral();
        this.ciudad = i.getCiudad();
        this.cantTitulares = cantTitulares;
    }
}
