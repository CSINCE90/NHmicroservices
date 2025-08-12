// DietPlanResponseDTO.java
package com.nutrihouse.diet_service.dto;

import com.nutrihouse.diet_service.model.MealType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DietPlanResponseDTO {
    private Long id;
    private Long patientId;
    private String title;
    private String notes;
    private Integer dayOfWeek;
    private String dayName; // "Lunedì", "Martedì", etc.
    private MealType mealType;
    private Long foodId;
    private String foodName;
    private Double quantity;
    private String unit;
    private Double calories;
    private Double proteins;
    private Double carbs;
    private Double fats;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
