package com.nutrihouse.food_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodSearchParams {
    private String name;
    private BigDecimal minCal;
    private BigDecimal maxCal;
    private BigDecimal minProt;
    private BigDecimal maxProt;
    private BigDecimal minCarb;
    private BigDecimal maxCarb;
    private BigDecimal minFat;
    private BigDecimal maxFat;
}