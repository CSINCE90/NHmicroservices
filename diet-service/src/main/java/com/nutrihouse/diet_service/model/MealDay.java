package com.nutrihouse.diet_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a day within a meal plan.
 */
@Entity
@Table(name = "meal_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealDay {

    /**
     * Primary key identifier for the MealDay entity.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many MealDay entities belong to one MealPlan.
     * Fetch type is LAZY to defer loading until needed.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id", nullable = false)
    private MealPlan mealPlan;

    /**
     * The index of the day within the meal plan (e.g., day 1, day 2).
     */
    @Column(nullable = false)
    private Integer dayIndex;

    /**
     * One MealDay has many MealItem entities.
     * Cascade all operations and remove orphans to keep data consistent.
     * Initialized as an empty ArrayList to avoid null references.
     */
    @OneToMany(mappedBy = "mealDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MealItem> items = new ArrayList<>();
}
