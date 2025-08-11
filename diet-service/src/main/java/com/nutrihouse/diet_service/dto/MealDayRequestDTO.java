package com.nutrihouse.diet_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

/** Payload per creare/aggiornare un giorno del piano. */
@Data
public class MealDayRequestDTO {
    @NotNull @Positive
    private Integer dayIndex;                       // 1..7 (o quello che decidi)

    @Valid
    private List<MealItemRequestDTO> items;        // opzionale: crea anche le righe pasto del giorno
}