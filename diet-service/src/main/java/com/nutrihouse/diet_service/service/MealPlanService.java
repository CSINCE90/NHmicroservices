
package com.nutrihouse.diet_service.service;

import com.nutrihouse.diet_service.dto.MealDayRequestDTO;
import com.nutrihouse.diet_service.dto.MealItemRequestDTO;
import com.nutrihouse.diet_service.dto.MealPlanRequestDTO;
import com.nutrihouse.diet_service.dto.MealDayResponseDTO;
import com.nutrihouse.diet_service.dto.MealItemResponseDTO;
import com.nutrihouse.diet_service.dto.MealPlanResponseDTO;
import com.nutrihouse.diet_service.model.*;
import com.nutrihouse.diet_service.repository.MealDayRepository;
import com.nutrihouse.diet_service.repository.MealItemRepository;
import com.nutrihouse.diet_service.repository.MealPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * Service dell'aggregate "MealPlan".
 *
 * Logica chiave:
 * - L'aggregate root è MealPlan; i figli (MealDay/MealItem) sono gestiti in cascata.
 * - Niente join cross-service: pazienteId e foodId sono FK logiche (numeriche).
 * - I mapper Entity <-> DTO sono interni al service per mantenere coesione.
 */
@Service
@RequiredArgsConstructor
public class MealPlanService {

    private final MealPlanRepository mealPlanRepository;
    private final MealDayRepository mealDayRepository;
    private final MealItemRepository mealItemRepository;

    // =====================
    // CRUD PIANO ALIMENTARE
    // =====================

    /**
     * Crea un nuovo piano alimentare. Opzionalmente crea anche i giorni e gli item passati nel payload.
     */
    @Transactional
    public MealPlanResponseDTO createPlan(MealPlanRequestDTO req) {
        // 1) Crea header del piano
        MealPlan plan = MealPlan.builder()
                .pazienteId(req.getPazienteId())
                .titolo(req.getTitolo())
                .note(req.getNote())
                .build();

        // 2) Aggiunge eventualmente i giorni con items dal DTO (aggregate composition)
        if (req.getGiorni() != null) {
            for (MealDayRequestDTO dayDTO : req.getGiorni()) {
                MealDay day = MealDay.builder()
                        .mealPlan(plan)
                        .dayIndex(dayDTO.getDayIndex())
                        .build();

                if (dayDTO.getItems() != null) {
                    for (MealItemRequestDTO itemDTO : dayDTO.getItems()) {
                        MealItem item = MealItem.builder()
                                .mealDay(day)
                                .foodId(itemDTO.getFoodId())
                                .quantity(itemDTO.getQuantity())
                                .unit(itemDTO.getUnit())
                                .mealType(itemDTO.getMealType())
                                .build();
                        day.getItems().add(item);
                    }
                }
                plan.getGiorni().add(day);
            }
        }

        MealPlan saved = mealPlanRepository.save(plan);
        return toPlanDTO(saved);
    }

    /** Recupera un piano per id. */
    @Transactional(readOnly = true)
    public MealPlanResponseDTO getPlan(Long planId) {
        MealPlan plan = mealPlanRepository.findById(planId)
                .orElseThrow(() -> new NoSuchElementException("MealPlan non trovato: " + planId));
        return toPlanDTO(plan);
    }

    /** Lista piani di un paziente. */
    @Transactional(readOnly = true)
    public List<MealPlanResponseDTO> getPlansByPaziente(Long pazienteId) {
        return mealPlanRepository.findByPazienteId(pazienteId).stream()
                .sorted(Comparator.comparing(MealPlan::getId).reversed())
                .map(this::toPlanDTO)
                .collect(Collectors.toList());
    }

    /** Elimina un piano e tutta la gerarchia (giorni + items) grazie a orphanRemoval=true. */
    @Transactional
    public boolean deletePlan(Long planId) {
        if (!mealPlanRepository.existsById(planId)) return false;
        mealPlanRepository.deleteById(planId);
        return true;
    }

    /** Aggiorna solo titolo/note dell'header del piano. */
    @Transactional
    public MealPlanResponseDTO updateHeader(Long planId, String nuovoTitolo, String nuoveNote) {
        MealPlan plan = mealPlanRepository.findById(planId)
                .orElseThrow(() -> new NoSuchElementException("MealPlan non trovato: " + planId));
        if (nuovoTitolo != null && !nuovoTitolo.isBlank()) plan.setTitolo(nuovoTitolo);
        plan.setNote(nuoveNote);
        return toPlanDTO(plan);
    }

    // =====================
    // GIORNI DEL PIANO
    // =====================

    /** Aggiunge (o restituisce se già esiste) un giorno al piano, identificato da dayIndex. */
    @Transactional
    public MealDayResponseDTO addOrGetDay(Long planId, Integer dayIndex) {
        MealPlan plan = mealPlanRepository.findById(planId)
                .orElseThrow(() -> new NoSuchElementException("MealPlan non trovato: " + planId));

        // prova a cercare già esistente
        return mealDayRepository.findByMealPlanIdAndDayIndex(plan.getId(), dayIndex)
                .map(this::toDayDTO)
                .orElseGet(() -> {
                    MealDay day = MealDay.builder()
                            .mealPlan(plan)
                            .dayIndex(dayIndex)
                            .items(new ArrayList<>())
                            .build();
                    MealDay saved = mealDayRepository.save(day);
                    return toDayDTO(saved);
                });
    }

    /** Rimuove un giorno (e relativi items). */
    @Transactional
    public boolean removeDay(Long dayId) {
        if (!mealDayRepository.existsById(dayId)) return false;
        mealDayRepository.deleteById(dayId);
        return true;
    }

    // =====================
    // ITEMS (righe pasto)
    // =====================

    /** Aggiunge una riga pasto ad uno specifico giorno del piano. */
    @Transactional
    public MealItemResponseDTO addItem(Long planId, Integer dayIndex, MealItemRequestDTO itemDTO) {
        MealDay day = mealDayRepository.findByMealPlanIdAndDayIndex(planId, dayIndex)
                .orElseGet(() -> { // se il giorno non esiste, lo creo al volo
                    MealPlan plan = mealPlanRepository.findById(planId)
                            .orElseThrow(() -> new NoSuchElementException("MealPlan non trovato: " + planId));
                    MealDay created = MealDay.builder().mealPlan(plan).dayIndex(dayIndex).build();
                    return mealDayRepository.save(created);
                });

        MealItem item = MealItem.builder()
                .mealDay(day)
                .foodId(itemDTO.getFoodId())
                .quantity(itemDTO.getQuantity())
                .unit(itemDTO.getUnit())
                .mealType(itemDTO.getMealType())
                .build();
        MealItem saved = mealItemRepository.save(item);
        return toItemDTO(saved);
    }

    /** Elimina una riga pasto. */
    @Transactional
    public boolean removeItem(Long itemId) {
        if (!mealItemRepository.existsById(itemId)) return false;
        mealItemRepository.deleteById(itemId);
        return true;
    }

    // =====================
    // MAPPER ENTITY -> DTO
    // =====================

    private MealPlanResponseDTO toPlanDTO(MealPlan entity) {
        List<MealDayResponseDTO> days = entity.getGiorni().stream()
                .sorted(Comparator.comparing(MealDay::getDayIndex))
                .map(this::toDayDTO)
                .collect(Collectors.toList());
        return MealPlanResponseDTO.builder()
                .id(entity.getId())
                .pazienteId(entity.getPazienteId())
                .titolo(entity.getTitolo())
                .note(entity.getNote())
                .giorni(days)
                .build();
    }

    private MealDayResponseDTO toDayDTO(MealDay entity) {
        List<MealItemResponseDTO> items = entity.getItems().stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());
        return MealDayResponseDTO.builder()
                .id(entity.getId())
                .dayIndex(entity.getDayIndex())
                .items(items)
                .build();
    }

    private MealItemResponseDTO toItemDTO(MealItem entity) {
        return MealItemResponseDTO.builder()
                .id(entity.getId())
                .foodId(entity.getFoodId())
                .quantity(entity.getQuantity())
                .unit(entity.getUnit())
                .mealType(entity.getMealType())
                .build();
    }
}
