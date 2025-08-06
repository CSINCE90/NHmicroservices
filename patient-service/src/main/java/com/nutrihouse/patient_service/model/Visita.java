package com.nutrihouse.patient_service.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "visite")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_visita", nullable = false)
    private LocalDateTime dataVisita;

    @Column(name = "stato", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private StatoVisita stato = StatoVisita.PROGRAMMATA;

    @Column(name = "peso")
    private Double peso;

    @Column(name = "altezza")
    private Double altezza;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "obiettivi", columnDefinition = "TEXT")
    private String obiettivi;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;

    @UpdateTimestamp
    @Column(name = "data_modifica")
    private LocalDateTime dataModifica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paziente_id", nullable = false)
    private Paziente paziente;

    // Campo legacy mantenuto per retrocompatibilità
    @Deprecated
    @Column(name = "data")
    private java.time.LocalDate data;

    @Deprecated
    @Column(name = "anamnesi", columnDefinition = "TEXT")
    private String anamnesi;

    // Enum per gli stati della visita
    public enum StatoVisita {
        PROGRAMMATA,
        COMPLETATA,
        ANNULLATA
    }
}