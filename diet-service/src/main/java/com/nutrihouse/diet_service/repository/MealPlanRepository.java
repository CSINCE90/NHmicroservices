package com.nutrihouse.diet_service.repository;

import com.nutrihouse.diet_service.model.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

    // Piani di un paziente (FK logica)
    List<MealPlan> findByPazienteId(Long pazienteId);

    // Ricerca semplice su titolo/note (stile searchPazienti)
    List<MealPlan> findByTitoloContainingIgnoreCaseOrNoteContainingIgnoreCase(String titolo, String note);

    // (Facoltativo) ultimo piano per paziente, usando l'id come ordinamento “creation-like”
    MealPlan findFirstByPazienteIdOrderByIdDesc(Long pazienteId);

    // Conteggio piani per paziente (stile countBySesso)
    @Query("select mp.pazienteId, count(mp) from MealPlan mp group by mp.pazienteId")
    List<Object[]> countPlansPerPaziente();
}