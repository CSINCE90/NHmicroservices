// DietPlanRequestDTO.java
package com.nutrihouse.diet_service.dto;

import com.nutrihouse.diet_service.model.MealType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DietPlanRequestDTO {
    
    @NotNull(message = "L'ID del paziente è obbligatorio")
    private Long patientId;
    
    @NotBlank(message = "Il titolo è obbligatorio")
    @Size(max = 255)
    private String title;
    
    @Size(max = 2000)
    private String notes;
    
    @NotNull(message = "Il giorno è obbligatorio")
    @Min(1) @Max(7)
    private Integer dayOfWeek;
    
    @NotNull(message = "Il tipo di pasto è obbligatorio")
    private MealType mealType;
    
    @NotNull(message = "L'ID dell'alimento è obbligatorio")
    private Long foodId;
    
    private String foodName;
    
    @NotNull(message = "La quantità è obbligatoria")
    @Positive(message = "La quantità deve essere positiva")
    private Double quantity;
    
    @NotBlank(message = "L'unità di misura è obbligatoria")
    @Size(max = 10)
    private String unit;
    
    private Double calories;
    private Double proteins;
    private Double carbs;
    private Double fats;
}
