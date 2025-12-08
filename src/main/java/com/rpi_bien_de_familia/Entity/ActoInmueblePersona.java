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
@Table(name = "actos_inmuebles_personas")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ActoInmueblePersona {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_acto_inmueble", nullable = false)
    private ActoInmueble actoInmueble;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_persona_inmueble", nullable = false)
    private PersonaInmueble personaInmueble;
}

