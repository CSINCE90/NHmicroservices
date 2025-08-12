package com.nutrihouse.diet_service.repository;

import com.nutrihouse.diet_service.model.DietPlan;
import com.nutrihouse.diet_service.model.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {

    // Trova tutti i piani di un paziente
    List<DietPlan> findByPatientIdAndActiveTrue(Long patientId);
    
    // Trova per paziente e titolo (per evitare duplicati)
    Optional<DietPlan> findByPatientIdAndTitleAndActiveTrue(Long patientId, String title);
    
    // Trova tutti gli elementi di un piano specifico
    @Query("SELECT dp FROM DietPlan dp WHERE dp.patientId = :patientId " +
           "AND dp.title = :title AND dp.active = true " +
           "ORDER BY dp.dayOfWeek, dp.mealType")
    List<DietPlan> findPlanItems(@Param("patientId") Long patientId, 
                                  @Param("title") String title);
    
    // Trova per giorno della settimana
    @Query("SELECT dp FROM DietPlan dp WHERE dp.patientId = :patientId " +
           "AND dp.title = :title AND dp.dayOfWeek = :dayOfWeek " +
           "AND dp.active = true ORDER BY dp.mealType")
    List<DietPlan> findByDay(@Param("patientId") Long patientId, 
                              @Param("title") String title,
                              @Param("dayOfWeek") Integer dayOfWeek);
    
    // Trova per tipo di pasto
    @Query("SELECT dp FROM DietPlan dp WHERE dp.patientId = :patientId " +
           "AND dp.title = :title AND dp.mealType = :mealType " +
           "AND dp.active = true ORDER BY dp.dayOfWeek")
    List<DietPlan> findByMealType(@Param("patientId") Long patientId, 
                                   @Param("title") String title,
                                   @Param("mealType") MealType mealType);
    
    // Trova elemento specifico del piano
    @Query("SELECT dp FROM DietPlan dp WHERE dp.patientId = :patientId " +
           "AND dp.title = :title AND dp.dayOfWeek = :dayOfWeek " +
           "AND dp.mealType = :mealType AND dp.foodId = :foodId " +
           "AND dp.active = true")
    Optional<DietPlan> findSpecificItem(@Param("patientId") Long patientId,
                                         @Param("title") String title,
                                         @Param("dayOfWeek") Integer dayOfWeek,
                                         @Param("mealType") MealType mealType,
                                         @Param("foodId") Long foodId);
    
    // Ottieni lista titoli piani distinti per paziente
    @Query("SELECT DISTINCT dp.title FROM DietPlan dp WHERE dp.patientId = :patientId " +
           "AND dp.active = true ORDER BY dp.title")
    List<String> findDistinctPlanTitles(@Param("patientId") Long patientId);
    
    // Soft delete di un intero piano
    @Modifying
    @Query("UPDATE DietPlan dp SET dp.active = false, dp.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE dp.patientId = :patientId AND dp.title = :title")
    void softDeletePlan(@Param("patientId") Long patientId, @Param("title") String title);
    
    // Conta elementi attivi di un piano
    @Query("SELECT COUNT(dp) FROM DietPlan dp WHERE dp.patientId = :patientId " +
           "AND dp.title = :title AND dp.active = true")
    Long countPlanItems(@Param("patientId") Long patientId, @Param("title") String title);
    
    // Calcola totali nutrizionali di un piano
    @Query("SELECT SUM(dp.calories) as totalCalories, " +
           "SUM(dp.proteins) as totalProteins, " +
           "SUM(dp.carbs) as totalCarbs, " +
           "SUM(dp.fats) as totalFats " +
           "FROM DietPlan dp WHERE dp.patientId = :patientId " +
           "AND dp.title = :title AND dp.active = true")
    Object[] calculateNutritionalTotals(@Param("patientId") Long patientId, 
                                        @Param("title") String title);
    
    // Verifica se esiste già un elemento simile (per evitare duplicati)
    boolean existsByPatientIdAndTitleAndDayOfWeekAndMealTypeAndFoodIdAndActiveTrue(
            Long patientId, String title, Integer dayOfWeek, MealType mealType, Long foodId);
}