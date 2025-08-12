// DietPlanUpdateDTO.java
package com.nutrihouse.diet_service.dto;

import com.nutrihouse.diet_service.model.MealType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DietPlanUpdateDTO {
    
    private String title;
    private String notes;
    
    @Min(1) @Max(7)
    private Integer dayOfWeek;
    
    private MealType mealType;
    
    private Long foodId;
    private String foodName;
    
    @Positive
    private Double quantity;
    
    @Size(max = 10)
    private String unit;
    
    private Double calories;
    private Double proteins;
    private Double carbs;
    private Double fats;
}

// -------------------