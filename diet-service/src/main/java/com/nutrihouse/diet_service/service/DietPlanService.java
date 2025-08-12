package com.nutrihouse.diet_service.service;

import com.nutrihouse.diet_service.dto.*;
import com.nutrihouse.diet_service.model.DietPlan;
import com.nutrihouse.diet_service.model.MealType;
import com.nutrihouse.diet_service.repository.DietPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DietPlanService {

    private final DietPlanRepository dietPlanRepository;
    
    private static final Map<Integer, String> DAY_NAMES = Map.of(
        1, "Lunedì",
        2, "Martedì", 
        3, "Mercoledì",
        4, "Giovedì",
        5, "Venerdì",
        6, "Sabato",
        7, "Domenica"
    );

    /**
     * Crea un nuovo elemento del piano alimentare
     */
    @Transactional
    public DietPlanResponseDTO create(DietPlanRequestDTO request) {
        log.info("Creazione nuovo elemento piano per paziente: {} - titolo: {}", 
                request.getPatientId(), request.getTitle());
        
        // Verifica se esiste già un elemento simile
        boolean exists = dietPlanRepository.existsByPatientIdAndTitleAndDayOfWeekAndMealTypeAndFoodIdAndActiveTrue(
            request.getPatientId(), request.getTitle(), request.getDayOfWeek(), 
            request.getMealType(), request.getFoodId()
        );
        
        if (exists) {
            throw new IllegalArgumentException("Elemento già presente nel piano per questo giorno e pasto");
        }
        
        DietPlan dietPlan = DietPlan.builder()
                .patientId(request.getPatientId())
                .title(request.getTitle())
                .notes(request.getNotes())
                .dayOfWeek(request.getDayOfWeek())
                .mealType(request.getMealType())
                .foodId(request.getFoodId())
                .foodName(request.getFoodName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .calories(request.getCalories())
                .proteins(request.getProteins())
                .carbs(request.getCarbs())
                .fats(request.getFats())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
        
        DietPlan saved = dietPlanRepository.save(dietPlan);
        return toResponseDTO(saved);
    }

    /**
     * Recupera un elemento per ID
     */
    @Transactional(readOnly = true)
    public DietPlanResponseDTO findById(Long id) {
        DietPlan dietPlan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Elemento non trovato con ID: " + id));
        return toResponseDTO(dietPlan);
    }

    /**
     * Recupera tutti gli elementi di un piano
     */
    @Transactional(readOnly = true)
    public List<DietPlanResponseDTO> findPlanItems(Long patientId, String title) {
        log.debug("Recupero elementi del piano '{}' per paziente {}", title, patientId);
        
        List<DietPlan> items = dietPlanRepository.findPlanItems(patientId, title);
        return items.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Recupera gli elementi di un giorno specifico
     */
    @Transactional(readOnly = true)
    public List<DietPlanResponseDTO> findByDay(Long patientId, String title, Integer dayOfWeek) {
        log.debug("Recupero elementi del giorno {} per piano '{}'", dayOfWeek, title);
        
        List<DietPlan> items = dietPlanRepository.findByDay(patientId, title, dayOfWeek);
        return items.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Recupera gli elementi per tipo di pasto
     */
    @Transactional(readOnly = true)
    public List<DietPlanResponseDTO> findByMealType(Long patientId, String title, MealType mealType) {
        log.debug("Recupero elementi {} per piano '{}'", mealType, title);
        
        List<DietPlan> items = dietPlanRepository.findByMealType(patientId, title, mealType);
        return items.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Recupera un riepilogo completo del piano
     */
    @Transactional(readOnly = true)
    public DietPlanSummaryDTO getPlanSummary(Long patientId, String title) {
        log.info("Generazione riepilogo per piano '{}' del paziente {}", title, patientId);
        
        List<DietPlan> items = dietPlanRepository.findPlanItems(patientId, title);
        
        if (items.isEmpty()) {
            throw new NoSuchElementException("Piano non trovato: " + title);
        }
        
        // Raggruppa per giorno
        Map<Integer, List<DietPlanResponseDTO>> itemsByDay = items.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.groupingBy(DietPlanResponseDTO::getDayOfWeek));
        
        // Raggruppa per tipo pasto
        Map<MealType, List<DietPlanResponseDTO>> itemsByMealType = items.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.groupingBy(DietPlanResponseDTO::getMealType));
        
        // Calcola totali nutrizionali
        Object[] nutritionData = dietPlanRepository.calculateNutritionalTotals(patientId, title);
        DietPlanSummaryDTO.NutritionalSummary nutrition = null;
        
        if (nutritionData != null && nutritionData.length > 0) {
            Object[] row = (Object[]) nutritionData[0];
            Double totalCalories = row[0] != null ? ((Number) row[0]).doubleValue() : 0.0;
            Double totalProteins = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            Double totalCarbs = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;
            Double totalFats = row[3] != null ? ((Number) row[3]).doubleValue() : 0.0;
            
            nutrition = DietPlanSummaryDTO.NutritionalSummary.builder()
                    .totalCalories(totalCalories)
                    .totalProteins(totalProteins)
                    .totalCarbs(totalCarbs)
                    .totalFats(totalFats)
                    .avgDailyCalories(totalCalories / 7) // Media settimanale
                    .build();
        }
        
        return DietPlanSummaryDTO.builder()
                .patientId(patientId)
                .title(title)
                .notes(items.get(0).getNotes())
                .totalItems(items.size())
                .itemsByDay(itemsByDay)
                .itemsByMealType(itemsByMealType)
                .totalNutrition(nutrition)
                .build();
    }

    /**
     * Recupera la lista dei titoli dei piani di un paziente
     */
    @Transactional(readOnly = true)
    public List<String> getPlanTitles(Long patientId) {
        log.debug("Recupero titoli piani per paziente {}", patientId);
        return dietPlanRepository.findDistinctPlanTitles(patientId);
    }

    /**
     * Aggiorna un elemento del piano
     */
    @Transactional
    public DietPlanResponseDTO update(Long id, DietPlanUpdateDTO request) {
        log.info("Aggiornamento elemento con ID: {}", id);
        
        DietPlan dietPlan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Elemento non trovato con ID: " + id));
        
        // Aggiorna solo i campi non nulli
        if (request.getTitle() != null) dietPlan.setTitle(request.getTitle());
        if (request.getNotes() != null) dietPlan.setNotes(request.getNotes());
        if (request.getDayOfWeek() != null) dietPlan.setDayOfWeek(request.getDayOfWeek());
        if (request.getMealType() != null) dietPlan.setMealType(request.getMealType());
        if (request.getFoodId() != null) dietPlan.setFoodId(request.getFoodId());
        if (request.getFoodName() != null) dietPlan.setFoodName(request.getFoodName());
        if (request.getQuantity() != null) dietPlan.setQuantity(request.getQuantity());
        if (request.getUnit() != null) dietPlan.setUnit(request.getUnit());
        if (request.getCalories() != null) dietPlan.setCalories(request.getCalories());
        if (request.getProteins() != null) dietPlan.setProteins(request.getProteins());
        if (request.getCarbs() != null) dietPlan.setCarbs(request.getCarbs());
        if (request.getFats() != null) dietPlan.setFats(request.getFats());
        
        dietPlan.setUpdatedAt(LocalDateTime.now());
        
        DietPlan updated = dietPlanRepository.save(dietPlan);
        return toResponseDTO(updated);
    }

    /**
     * Elimina (soft delete) un singolo elemento
     */
    @Transactional
    public void deleteItem(Long id) {
        log.info("Eliminazione elemento con ID: {}", id);
        
        DietPlan dietPlan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Elemento non trovato con ID: " + id));
        
        dietPlan.setActive(false);
        dietPlan.setUpdatedAt(LocalDateTime.now());
        dietPlanRepository.save(dietPlan);
    }

    /**
     * Elimina (soft delete) un intero piano
     */
    @Transactional
    public void deletePlan(Long patientId, String title) {
        log.info("Eliminazione piano '{}' per paziente {}", title, patientId);
        dietPlanRepository.softDeletePlan(patientId, title);
    }

    /**
     * Duplica un piano esistente con un nuovo titolo
     */
    @Transactional
    public List<DietPlanResponseDTO> duplicatePlan(Long patientId, String sourceTitle, String newTitle) {
        log.info("Duplicazione piano '{}' con nuovo titolo '{}'", sourceTitle, newTitle);
        
        // Verifica che il nuovo titolo non esista già
        Optional<DietPlan> existing = dietPlanRepository.findByPatientIdAndTitleAndActiveTrue(patientId, newTitle);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Esiste già un piano con titolo: " + newTitle);
        }
        
        // Recupera tutti gli elementi del piano originale
        List<DietPlan> sourceItems = dietPlanRepository.findPlanItems(patientId, sourceTitle);
        if (sourceItems.isEmpty()) {
            throw new NoSuchElementException("Piano sorgente non trovato: " + sourceTitle);
        }
        
        // Crea copie con il nuovo titolo
        List<DietPlan> newItems = sourceItems.stream()
                .map(item -> DietPlan.builder()
                        .patientId(item.getPatientId())
                        .title(newTitle)
                        .notes(item.getNotes())
                        .dayOfWeek(item.getDayOfWeek())
                        .mealType(item.getMealType())
                        .foodId(item.getFoodId())
                        .foodName(item.getFoodName())
                        .quantity(item.getQuantity())
                        .unit(item.getUnit())
                        .calories(item.getCalories())
                        .proteins(item.getProteins())
                        .carbs(item.getCarbs())
                        .fats(item.getFats())
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build())
                .collect(Collectors.toList());
        
        List<DietPlan> saved = dietPlanRepository.saveAll(newItems);
        
        return saved.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Converte entity in DTO
     */
    private DietPlanResponseDTO toResponseDTO(DietPlan entity) {
        return DietPlanResponseDTO.builder()
                .id(entity.getId())
                .patientId(entity.getPatientId())
                .title(entity.getTitle())
                .notes(entity.getNotes())
                .dayOfWeek(entity.getDayOfWeek())
                .dayName(DAY_NAMES.get(entity.getDayOfWeek()))
                .mealType(entity.getMealType())
                .foodId(entity.getFoodId())
                .foodName(entity.getFoodName())
                .quantity(entity.getQuantity())
                .unit(entity.getUnit())
                .calories(entity.getCalories())
                .proteins(entity.getProteins())
                .carbs(entity.getCarbs())
                .fats(entity.getFats())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}