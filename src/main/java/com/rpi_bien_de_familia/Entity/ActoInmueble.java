package com.rpi_bien_de_familia.Entity;

import java.time.LocalDate;

import com.rpi_bien_de_familia.Config.LocalDateToStringConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
@Table(name = "actos_inmuebles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ActoInmueble {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_acto_registral", nullable = false)
    private ActoRegistral actoRegistral;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_inmueble", nullable = false)
    private Inmueble inmueble;

    @Convert(converter = LocalDateToStringConverter.class)
    @Column(nullable = false)
    private LocalDate fechaDesde;

    @Convert(converter = LocalDateToStringConverter.class)
    private LocalDate fechaHasta; // null = vigente

    @Column(length = 150)
    private String juzgado;

    @Column(length = 50)
    private String numeroExpediente;
    
    @Column(length = 20)
    private String tomo;
    
    @Column(length = 20)
    private String folio;
    
    @Column(length = 20)
    private String libro;
    
    @Column(length = 500)
    private String observaciones;
}
