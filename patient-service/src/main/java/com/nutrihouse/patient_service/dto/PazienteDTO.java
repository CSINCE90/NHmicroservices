package com.nutrihouse.patient_service.dto;

import lombok.Data;

@Data
public class PazienteDTO {
    private Long id;
    private String fullName;
    private String email;
    private String codiceFiscale;
    private String dataNascita;
    private String telefono;
    private String indirizzo;
    
}