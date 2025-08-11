package com.nutrihouse.diet_service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Risposta di un giorno del piano, con le sue righe. */
@Data @Builder
public class MealDayResponseDTO {
    private Long id;
    private Integer dayIndex;
    private List<MealItemResponseDTO> items;
}