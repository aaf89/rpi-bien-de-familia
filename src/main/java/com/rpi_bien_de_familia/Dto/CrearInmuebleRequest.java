package com.rpi_bien_de_familia.Dto;

import lombok.Data;

@Data
public class CrearInmuebleRequest {
    private String matricula;
    private String nomenclaturaCatastral;
    private Long personaId;
    private Long ciudadId;
}

