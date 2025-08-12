package com.nutrihouse.diet_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entità semplificata per il piano alimentare.
 * Ogni record rappresenta un singolo elemento del piano con tutti i dati necessari.
 */
@Entity
@Table(name = "diet_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del paziente a cui appartiene questo piano
     */
    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    /**
     * Titolo del piano alimentare (es. "Piano Dimagrimento Gennaio")
     */
    @Column(nullable = false)
    private String title;

    /**
     * Note generali sul piano
     */
    @Column(length = 2000)
    private String notes;

    /**
     * Giorno della settimana (1=Lunedì, 7=Domenica)
     */
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    /**
     * Tipo di pasto
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 20)
    private MealType mealType;

    /**
     * ID dell'alimento (riferimento al food-service)
     */
    @Column(name = "food_id", nullable = false)
    private Long foodId;

    /**
     * Nome dell'alimento (cached per evitare chiamate continue)
     */
    @Column(name = "food_name")
    private String foodName;

    /**
     * Quantità dell'alimento
     */
    @Column(nullable = false)
    private Double quantity;

    /**
     * Unità di misura (g, ml, pz, etc.)
     */
    @Column(nullable = false, length = 10)
    private String unit;

    /**
     * Calorie totali per questa porzione
     */
    @Column
    private Double calories;

    /**
     * Proteine in grammi
     */
    @Column
    private Double proteins;

    /**
     * Carboidrati in grammi
     */
    @Column
    private Double carbs;

    /**
     * Grassi in grammi
     */
    @Column
    private Double fats;

    /**
     * Flag per indicare se questo elemento è attivo
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * Data di creazione
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Data ultima modifica
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}