package com.rpi_bien_de_familia.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "personas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Persona {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Pattern(
    		regexp = "^(\\d{2}[-]?\\d{8}[-]?\\d{1})$",
    	    message = "El cuit debe tener el formato XX-XXXXXXXX-XX"
    )
    private String cuit;      
    private String apellido;
    private String nombre;

}