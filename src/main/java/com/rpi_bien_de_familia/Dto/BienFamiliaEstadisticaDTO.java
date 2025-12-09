package com.rpi_bien_de_familia.Dto;

public class BienFamiliaEstadisticaDTO {

    private Integer anio;
    private String departamento;
    private Long cantidad;

    public BienFamiliaEstadisticaDTO(Integer anio, String departamento, Long cantidad) {
        this.anio = anio;
        this.departamento = departamento;
        this.cantidad = cantidad;
    }

    public Integer getAnio() {
        return anio;
    }

    public String getDepartamento() {
        return departamento;
    }

    public Long getCantidad() {
        return cantidad;
    }
}
