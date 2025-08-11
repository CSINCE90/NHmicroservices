package com.nutrihouse.diet_service.dto;


import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Risposta completa di un piano: header + giorni + items. */
@Data @Builder
public class MealPlanResponseDTO {
    private Long id;
    private Long pazienteId;
    private String titolo;
    private String note;
    private List<MealDayResponseDTO> giorni;
}