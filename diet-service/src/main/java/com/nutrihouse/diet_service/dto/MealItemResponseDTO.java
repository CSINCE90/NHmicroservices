package com.nutrihouse.diet_service.dto;

import com.nutrihouse.diet_service.model.MealType;
import lombok.Builder;
import lombok.Data;

/** Risposta “piatta” per una riga pasto. */
@Data @Builder
public class MealItemResponseDTO {
    private Long id;
    private Long foodId;
    private Double quantity;
    private String unit;
    private MealType mealType;

    // Campi opzionali futuri (es. nome alimento, kcal, macro) ottenibili via Feign da food-service.
    // private String foodName;
    // private Double calorie;
    // private Double proteine;
    // private Double carboidrati;
    // private Double grassi;
}