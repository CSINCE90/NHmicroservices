package com.nutrihouse.diet_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meal_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealItem {

    /**
     * Unique identifier for the MealItem entity.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Reference to the MealDay entity this MealItem belongs to.
     * Many MealItems can be associated with one MealDay.
     * Fetch type is LAZY to optimize performance.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_day_id", nullable = false)
    @ToString.Exclude
    private MealDay mealDay;

    /**
     * Identifier of the food item associated with this MealItem.
     */
    @Column(nullable = false)
    private Long foodId;

    /**
     * Quantity of the food item consumed in this meal.
     */
    @Column(nullable = false)
    private Double quantity;

    /**
     * Unit of measurement for the quantity (e.g., grams, pieces).
     */
    @Column(nullable = false, length = 10)
    private String unit;

    /**
     * Type of the meal (e.g., BREAKFAST, LUNCH, DINNER).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MealType mealType;
}
