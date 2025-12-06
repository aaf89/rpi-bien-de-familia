package com.rpi_bien_de_familia.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="inmuebles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inmueble {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
    private String matricula;
    private String nomenclaturaCatastral;

    @ManyToOne
    @JoinColumn(name="id_ciudad")
    private Ciudad ciudad;
	
}
