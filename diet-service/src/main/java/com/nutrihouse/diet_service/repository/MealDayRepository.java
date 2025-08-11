package com.nutrihouse.diet_service.repository;

import com.nutrihouse.diet_service.model.MealDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MealDayRepository extends JpaRepository<MealDay, Long> {

    // Giorni di un piano ordinati (stile findBy...OrderBy...)
    List<MealDay> findByMealPlanIdOrderByDayIndexAsc(Long mealPlanId);

    // Recupero giorno specifico del piano (utile per update/add item)
    Optional<MealDay> findByMealPlanIdAndDayIndex(Long mealPlanId, Integer dayIndex);
}