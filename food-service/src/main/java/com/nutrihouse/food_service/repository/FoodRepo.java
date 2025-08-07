package com.nutrihouse.food_service.repository;

import com.nutrihouse.food_service.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FoodRepo extends JpaRepository<Food, Long> {

    // Ricerca per nome (contains, case-insensitive)
    List<Food> findByNameContainingIgnoreCase(String name);

    // Verifica esistenza per nome (case-insensitive) — utile per evitare duplicati
    boolean existsByNameIgnoreCase(String name);

    // Prime 10 in ordine alfabetico (quick lookup/autocomplete)
    List<Food> findTop10ByOrderByNameAsc();

    // Ricerca avanzata con filtri opzionali su nome e range macro
    @Query("""
           SELECT f FROM Food f
           WHERE (:name IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%')))
             AND (:minCal IS NULL OR f.calories >= :minCal)
             AND (:maxCal IS NULL OR f.calories <= :maxCal)
             AND (:minProt IS NULL OR f.protein >= :minProt)
             AND (:maxProt IS NULL OR f.protein <= :maxProt)
             AND (:minCarb IS NULL OR f.carbs >= :minCarb)
             AND (:maxCarb IS NULL OR f.carbs <= :maxCarb)
             AND (:minFat IS NULL OR f.fat >= :minFat)
             AND (:maxFat IS NULL OR f.fat <= :maxFat)
           ORDER BY f.name ASC
           """)
    List<Food> search(
            @Param("name") String name,
            @Param("minCal") BigDecimal minCal,
            @Param("maxCal") BigDecimal maxCal,
            @Param("minProt") BigDecimal minProt,
            @Param("maxProt") BigDecimal maxProt,
            @Param("minCarb") BigDecimal minCarb,
            @Param("maxCarb") BigDecimal maxCarb,
            @Param("minFat") BigDecimal minFat,
            @Param("maxFat") BigDecimal maxFat
    );
}
