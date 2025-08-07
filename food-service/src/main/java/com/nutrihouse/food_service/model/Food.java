package com.nutrihouse.food_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "food")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nome dell'alimento */
    @Column(nullable = false, length = 100)
    private String name;

    /** Calorie per 100g */
    @Column(nullable = false)
    private BigDecimal calories;

    /** Proteine per 100g */
    @Column(nullable = false)
    private BigDecimal protein;

    /** Carboidrati per 100g */
    @Column(nullable = false)
    private BigDecimal carbs;

    /** Grassi per 100g */
    @Column(nullable = false)
    private BigDecimal fat;

    /** URL immagine dell'alimento */
    @Column(length = 255)
    private String photoUrl;
}