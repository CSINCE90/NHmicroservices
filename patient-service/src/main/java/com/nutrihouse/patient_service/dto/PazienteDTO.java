package com.nutrihouse.patient_service.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PazienteDTO {
    private Long id;
    
    // Informazioni personali
    private String nome;
    private String cognome;
    private LocalDate dataNascita;
    private String sesso; // M/F
    private String email;
    private String telefono;
    
    // Dati fisici
    private Double altezza;
    private Double peso;
    
    // Altri campi
    private String obiettivo;
    private String note;
    
    // NUOVO CAMPO: Email dell'utente che ha creato il paziente  
    private String createdBy;
    
    // Metadati
    private LocalDateTime dataCreazione;
    private LocalDateTime dataModifica;
    
    // Campo legacy mantenuto per retrocompatibilità
    @Deprecated
    private String fullName;
    @Deprecated
    private String codiceFiscale;
    @Deprecated
    private String indirizzo;
}