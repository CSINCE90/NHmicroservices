package com.nutrihouse.patient_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VisitaDTO {
    private Long id;
    
    // Riferimento al paziente
    private Long pazienteId;
    
    // Dati della visita
    private LocalDateTime dataVisita;
    private String stato; // PROGRAMMATA, COMPLETATA, ANNULLATA
    
    // Misurazioni
    private Double peso;
    private Double altezza;
    
    // Note e obiettivi
    private String note;
    private String obiettivi;
    
    // Anamnesi (campo legacy)
    @Deprecated
    private String anamnesi;
    
    // Metadati
    private LocalDateTime dataCreazione;
    private LocalDateTime dataModifica;
    
    // Informazioni paziente (per visualizzazione)
    private PazienteDTO paziente;
}