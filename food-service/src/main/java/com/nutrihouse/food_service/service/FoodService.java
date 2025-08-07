package com.nutrihouse.food_service.service;

import com.nutrihouse.food_service.dto.FoodDTO;
import com.nutrihouse.food_service.dto.FoodSearchParams;
import com.nutrihouse.food_service.model.Food;
import com.nutrihouse.food_service.repository.FoodRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepo foodRepository;

    public FoodDTO saveFood(FoodDTO foodDTO) {
        Food food = new Food(
                foodDTO.getId(),
                foodDTO.getName(),
                foodDTO.getCalories(),
                foodDTO.getProtein(),
                foodDTO.getCarbs(),
                foodDTO.getFat(),
                foodDTO.getPhotoUrl()
        );
        Food savedFood = foodRepository.save(food);
        return new FoodDTO(
                savedFood.getId(),
                savedFood.getName(),
                savedFood.getCalories(),
                savedFood.getProtein(),
                savedFood.getCarbs(),
                savedFood.getFat(),
                savedFood.getPhotoUrl()
        );
    }

    public List<FoodDTO> getAllFoods() {
        return foodRepository.findAll().stream()
                .map(food -> new FoodDTO(
                        food.getId(),
                        food.getName(),
                        food.getCalories(),
                        food.getProtein(),
                        food.getCarbs(),
                        food.getFat(),
                        food.getPhotoUrl()
                ))
                .collect(Collectors.toList());
    }

    public FoodDTO getFoodById(Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Food not found with id: " + id));
        return new FoodDTO(
                food.getId(),
                food.getName(),
                food.getCalories(),
                food.getProtein(),
                food.getCarbs(),
                food.getFat(),
                food.getPhotoUrl()
        );
    }

    public FoodDTO updateFood(Long id, FoodDTO dto) {
        Food existing = foodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Food not found with id: " + id));

        // aggiorna i campi
        existing.setName(dto.getName());
        existing.setCalories(dto.getCalories());
        existing.setProtein(dto.getProtein());
        existing.setCarbs(dto.getCarbs());
        existing.setFat(dto.getFat());
        existing.setPhotoUrl(dto.getPhotoUrl());

        Food saved = foodRepository.save(existing);
        return new FoodDTO(
                saved.getId(),
                saved.getName(),
                saved.getCalories(),
                saved.getProtein(),
                saved.getCarbs(),
                saved.getFat(),
                saved.getPhotoUrl()
        );
    }

    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new EntityNotFoundException("Food not found with id: " + id);
        }
        foodRepository.deleteById(id);
    }

    public List<FoodDTO> searchFoods(FoodSearchParams params) {
        return foodRepository.search(
                params.getName(),
                params.getMinCal(),
                params.getMaxCal(),
                params.getMinProt(),
                params.getMaxProt(),
                params.getMinCarb(),
                params.getMaxCarb(),
                params.getMinFat(),
                params.getMaxFat()
        ).stream()
                .map(food -> new FoodDTO(
                        food.getId(),
                        food.getName(),
                        food.getCalories(),
                        food.getProtein(),
                        food.getCarbs(),
                        food.getFat(),
                        food.getPhotoUrl()
                ))
                .collect(Collectors.toList());
    }
}
