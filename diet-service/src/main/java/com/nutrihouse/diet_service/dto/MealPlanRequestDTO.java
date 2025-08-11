package com.nutrihouse.diet_service.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/** Payload per creare/aggiornare un piano alimentare. */
@Data
public class MealPlanRequestDTO {
    @NotNull
    private Long pazienteId;                         // id del paziente (FK logica)

    @NotBlank
    private String titolo;

    private String note;

    @Valid
    private List<MealDayRequestDTO> giorni;         // opzionale: crea anche i giorni in cascata
}