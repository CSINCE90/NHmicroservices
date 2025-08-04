package com.nutrihouse.patient_service.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "visita")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data", nullable = false)
    private LocalDate data; // Puoi usare LocalDate se vuoi tipo forte

    @Column(name = "anamnesi", columnDefinition = "TEXT")
    private String anamnesi; // Testo libero, senza limiti pratici

    @ManyToOne
    @JoinColumn(name = "paziente_id", nullable = false)
    private Paziente paziente;
}