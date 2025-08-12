package com.nutrihouse.diet_service.dto;

import com.nutrihouse.diet_service.model.MealType;


import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DietPlanSummaryDTO {
    private Long patientId;
    private String title;
    private String notes;
    private Integer totalItems;
    private Map<Integer, List<DietPlanResponseDTO>> itemsByDay; // Raggruppati per giorno
    private Map<MealType, List<DietPlanResponseDTO>> itemsByMealType; // Raggruppati per tipo pasto
    private NutritionalSummary totalNutrition;
    
    @Data
    @Builder
    public static class NutritionalSummary {
        private Double totalCalories;
        private Double totalProteins;
        private Double totalCarbs;
        private Double totalFats;
        private Double avgDailyCalories;
    }
}