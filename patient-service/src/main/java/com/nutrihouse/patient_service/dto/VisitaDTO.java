package com.nutrihouse.patient_service.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class VisitaDTO {
    private Long id;
    private LocalDate data;
    private String anamnesi;
    private Long pazienteId; // solo l'id del paziente, niente reference dirette
}