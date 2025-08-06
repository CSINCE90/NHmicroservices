package com.nutrihouse.patient_service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "pazienti")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Paziente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, length = 50)
    private String nome;

    @Column(name = "cognome", nullable = false, length = 50)
    private String cognome;

    @Column(name = "data_nascita", nullable = false)
    private LocalDate dataNascita;

    @Column(name = "sesso", length = 1)
    private String sesso; // M/F

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "altezza")
    private Double altezza;

    @Column(name = "peso")
    private Double peso;

    @Column(name = "obiettivo", length = 255)
    private String obiettivo;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;

    @UpdateTimestamp
    @Column(name = "data_modifica")
    private LocalDateTime dataModifica;

    // Relazioni
    @OneToMany(mappedBy = "paziente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Visita> visite;

    // Campi legacy mantenuti per retrocompatibilità
    @Deprecated
    @Column(name = "full_name")
    private String fullName;
    
    @Deprecated
    @Column(name = "codice_fiscale", length = 16)
    private String codiceFiscale;
    
    @Deprecated
    @Column(name = "indirizzo")
    private String indirizzo;
}