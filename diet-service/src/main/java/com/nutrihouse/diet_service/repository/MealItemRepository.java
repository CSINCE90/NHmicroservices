package com.nutrihouse.diet_service.repository;

import com.nutrihouse.diet_service.model.MealItem;
import com.nutrihouse.diet_service.model.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MealItemRepository extends JpaRepository<MealItem, Long> {

    // Items di un giorno
    List<MealItem> findByMealDayId(Long mealDayId);

    // Items di un intero piano (join navigando day -> plan)
    @Query("select i from MealItem i join i.mealDay d join d.mealPlan p " +
           "where p.id = :mealPlanId order by d.dayIndex asc, i.id asc")
    List<MealItem> findAllByMealPlanId(Long mealPlanId);

    // Items filtrati per tipo pasto nel piano
    @Query("select i from MealItem i join i.mealDay d join d.mealPlan p " +
           "where p.id = :mealPlanId and i.mealType = :mealType order by d.dayIndex asc")
    List<MealItem> findByMealPlanIdAndMealType(Long mealPlanId, MealType mealType);

    // Conteggio items per tipo pasto nel piano (stile aggregazioni)
    @Query("select i.mealType, count(i) from MealItem i join i.mealDay d join d.mealPlan p " +
           "where p.id = :mealPlanId group by i.mealType")
    List<Object[]> countItemsByTypeInPlan(Long mealPlanId);

    // Ricerca per alimento (foodId) dentro un piano
    @Query("select i from MealItem i join i.mealDay d join d.mealPlan p " +
           "where p.id = :mealPlanId and i.foodId = :foodId")
    List<MealItem> findByMealPlanIdAndFoodId(Long mealPlanId, Long foodId);
}