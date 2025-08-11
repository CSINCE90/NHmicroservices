package com.nutrihouse.diet_service.dto;

import com.nutrihouse.diet_service.model.MealType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** Payload per creare/aggiornare una riga pasto (senza id e senza riferimenti a entità JPA). */
@Data
public class MealItemRequestDTO {
    @NotNull
    private Long foodId;                 // id alimento (proveniente dal food-service)

    @NotNull @Positive
    private Double quantity;             // es. 100.0

    @NotNull @Size(min = 1, max = 10)
    private String unit;                 // "g", "ml", "pz"

    @NotNull
    private MealType mealType;           // COLAZIONE/PRANZO/CENA/SNACK
}