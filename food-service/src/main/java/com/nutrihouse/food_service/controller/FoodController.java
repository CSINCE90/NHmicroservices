package com.nutrihouse.food_service.controller;

import com.nutrihouse.food_service.dto.FoodDTO;
import com.nutrihouse.food_service.dto.FoodSearchParams;
import com.nutrihouse.food_service.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FoodDTO create(@RequestBody @Valid FoodDTO dto) {
        return foodService.saveFood(dto);
    }

    // READ ALL
    @GetMapping
    public List<FoodDTO> getAll() {
        return foodService.getAllFoods();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public FoodDTO getById(@PathVariable Long id) {
        return foodService.getFoodById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public FoodDTO update(@PathVariable Long id, @RequestBody @Valid FoodDTO dto) {
        return foodService.updateFood(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        foodService.deleteFood(id);
    }

    // SEARCH
    @GetMapping("/search")
    public List<FoodDTO> search(@Valid FoodSearchParams params) {
        return foodService.searchFoods(params);
    }
}
