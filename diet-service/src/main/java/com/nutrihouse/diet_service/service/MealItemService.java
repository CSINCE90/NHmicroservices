package com.nutrihouse.diet_service.service;

import com.nutrihouse.diet_service.dto.MealItemRequestDTO;
import com.nutrihouse.diet_service.dto.MealItemResponseDTO;
import com.nutrihouse.diet_service.model.MealDay;
import com.nutrihouse.diet_service.model.MealItem;
import com.nutrihouse.diet_service.repository.MealDayRepository;
import com.nutrihouse.diet_service.repository.MealItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class MealItemService {

    private final MealItemRepository mealItemRepository;
    private final MealDayRepository mealDayRepository;

    // === CREATE ===
    @Transactional
    public MealItemResponseDTO addItem(Long dayId, MealItemRequestDTO request) {
        MealDay day = mealDayRepository.findById(dayId)
                .orElseThrow(() -> new NoSuchElementException("Giorno non trovato: " + dayId));

        MealItem entity = MealItem.builder()
                .mealDay(day)
                .foodId(request.getFoodId())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .mealType(request.getMealType())
                .build();

        MealItem saved = mealItemRepository.save(entity);
        log.info("Creato MealItem id={} per dayId={}", saved.getId(), dayId);
        return toDTO(saved);
    }

    // === READ ===
    @Transactional(readOnly = true)
    public MealItemResponseDTO getItemById(Long itemId) {
        MealItem item = mealItemRepository.findById(itemId)
                .orElseThrow(() -> new NoSuchElementException("Item non trovato: " + itemId));
        return toDTO(item);
    }

    @Transactional(readOnly = true)
    public List<MealItemResponseDTO> listByDay(Long dayId) {
        return mealItemRepository.findByMealDayId(dayId)
                .stream().map(this::toDTO).toList();
    }

    // === UPDATE ===
    @Transactional
    public MealItemResponseDTO update(Long itemId, MealItemRequestDTO request) {
        MealItem item = mealItemRepository.findById(itemId)
                .orElseThrow(() -> new NoSuchElementException("Item non trovato: " + itemId));

        item.setFoodId(request.getFoodId());
        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit());
        item.setMealType(request.getMealType());

        return toDTO(item);
    }

    // === DELETE ===
    @Transactional
    public boolean delete(Long itemId) {
        if (!mealItemRepository.existsById(itemId)) return false;
        mealItemRepository.deleteById(itemId);
        return true;
    }

    // === Mapper ===
    private MealItemResponseDTO toDTO(MealItem e) {
        return MealItemResponseDTO.builder()
                .id(e.getId())
                .foodId(e.getFoodId())
                .quantity(e.getQuantity())
                .unit(e.getUnit())
                .mealType(e.getMealType())
                .build();
    }

    // ===== Alias per compatibilità col controller =====
    @Transactional(readOnly = true)
    public List<MealItemResponseDTO> getItemsByDay(Long dayId) {
        return listByDay(dayId);
    }

    @Transactional
    public MealItemResponseDTO updateItem(Long itemId, MealItemRequestDTO request) {
        return update(itemId, request);
    }

    @Transactional
    public boolean deleteItem(Long itemId) {
        return delete(itemId);
    }
}