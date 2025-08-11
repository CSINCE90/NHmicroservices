package com.nutrihouse.diet_service.service;

import com.nutrihouse.diet_service.dto.MealDayResponseDTO;
import com.nutrihouse.diet_service.dto.MealItemResponseDTO;
import com.nutrihouse.diet_service.model.MealDay;
import com.nutrihouse.diet_service.model.MealItem;
import com.nutrihouse.diet_service.repository.MealDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class MealDayService {

    private final MealDayRepository mealDayRepository;

    @Transactional(readOnly = true)
    public MealDayResponseDTO getById(Long dayId) {
        MealDay day = mealDayRepository.findById(dayId)
                .orElseThrow(() -> new NoSuchElementException("MealDay non trovato: " + dayId));
        return toDTO(day);
    }

    @Transactional(readOnly = true)
    public List<MealDayResponseDTO> listByPlan(Long mealPlanId) {
        return mealDayRepository.findByMealPlanIdOrderByDayIndexAsc(mealPlanId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public MealDayResponseDTO updateDayIndex(Long dayId, Integer newIndex) {
        MealDay day = mealDayRepository.findById(dayId)
                .orElseThrow(() -> new NoSuchElementException("MealDay non trovato: " + dayId));
        day.setDayIndex(newIndex);
        return toDTO(day);
    }

    @Transactional
    public boolean delete(Long dayId) {
        if (!mealDayRepository.existsById(dayId)) return false;
        mealDayRepository.deleteById(dayId);
        return true;
    }

    // ---- mapper
    private MealDayResponseDTO toDTO(MealDay entity) {
        var items = entity.getItems().stream()
                .sorted(Comparator.comparing(MealItem::getId))
                .map(i -> MealItemResponseDTO.builder()
                        .id(i.getId())
                        .foodId(i.getFoodId())
                        .quantity(i.getQuantity())
                        .unit(i.getUnit())
                        .mealType(i.getMealType())
                        .build())
                .toList();

        return MealDayResponseDTO.builder()
                .id(entity.getId())
                .dayIndex(entity.getDayIndex())
                .items(items)
                .build();
    }
}