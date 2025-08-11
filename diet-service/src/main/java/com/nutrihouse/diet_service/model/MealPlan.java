package com.nutrihouse.diet_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

/**
 * Rappresenta un piano alimentare associato ad un paziente.
 * Questa entità contiene informazioni generali sul piano e una lista di giorni,
 * ognuno dei quali rappresenta un insieme di pasti per un giorno specifico.
 */
@Entity
@Table(name = "meal_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlan {

    /**
     * Identificativo univoco del piano alimentare.
     * Generato automaticamente dal database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Identificativo del paziente a cui è associato questo piano alimentare.
     * Non è una relazione JPA ma un campo semplice che identifica il paziente.
     */
    @Column(name = "patient_id", nullable = false)
    private Long pazienteId;

    /**
     * Titolo o nome descrittivo del piano alimentare.
     * Utile per identificare rapidamente il piano.
     */
    @Column(nullable = false)
    private String titolo;

    /**
     * Note aggiuntive o commenti relativi al piano alimentare.
     * Campo opzionale per fornire dettagli extra.
     */
    @Column(length = 2000)
    private String note;

    /**
     * Lista dei giorni che compongono il piano alimentare.
     * Relazione OneToMany con MealDay: un piano contiene molti giorni.
     * La fetch è lazy per caricare i giorni solo quando necessario.
     * Cascade permette di propagare le operazioni di persistenza.
     */
    @OneToMany(mappedBy = "mealPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MealDay> giorni;
}
