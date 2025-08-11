package com.nutrihouse.diet_service.controller;

import com.nutrihouse.diet_service.dto.MealDayResponseDTO;
import com.nutrihouse.diet_service.service.MealDayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NUTRITIONIST')")
@Tag(name = "Giorni del piano", description = "API per la gestione dei giorni dei piani alimentari")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class MealDayController {

    private final MealDayService mealDayService;

    @Operation(summary = "Ottieni giorno per ID", description = "Recupera un giorno del piano alimentare tramite il suo ID")
    @ApiResponse(responseCode = "200", description = "Giorno trovato")
    @ApiResponse(responseCode = "404", description = "Giorno non trovato")
    @GetMapping("/days/{dayId}")
    public ResponseEntity<MealDayResponseDTO> getById(
            @Parameter(description = "ID del giorno") @PathVariable Long dayId) {
        log.debug("Richiesta giorno ID: {}", dayId);
        MealDayResponseDTO dto = mealDayService.getById(dayId);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Lista giorni del piano", description = "Recupera tutti i giorni di un piano ordinati per indice")
    @ApiResponse(responseCode = "200", description = "Lista giorni recuperata")
    @GetMapping("/{planId}/days")
    public ResponseEntity<List<MealDayResponseDTO>> listByPlan(
            @Parameter(description = "ID del piano") @PathVariable Long planId) {
        log.debug("Lista giorni per piano {}", planId);
        List<MealDayResponseDTO> list = mealDayService.listByPlan(planId);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Aggiorna l'indice del giorno", description = "Aggiorna il numero/indice (1..7) del giorno")
    @ApiResponse(responseCode = "200", description = "Giorno aggiornato con successo")
    @ApiResponse(responseCode = "404", description = "Giorno non trovato")
    @PatchMapping("/days/{dayId}")
    public ResponseEntity<MealDayResponseDTO> updateDayIndex(
            @Parameter(description = "ID del giorno") @PathVariable Long dayId,
            @Parameter(description = "Nuovo indice del giorno (1..7)")
            @RequestParam @Positive Integer dayIndex) {
        log.info("Update dayIndex per dayId {} -> {}", dayId, dayIndex);
        MealDayResponseDTO dto = mealDayService.updateDayIndex(dayId, dayIndex);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Elimina giorno", description = "Elimina un giorno del piano e i relativi item")
    @ApiResponse(responseCode = "204", description = "Giorno eliminato con successo")
    @ApiResponse(responseCode = "404", description = "Giorno non trovato")
    @DeleteMapping("/days/{dayId}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del giorno") @PathVariable Long dayId) {
        log.info("Eliminazione giorno ID: {}", dayId);
        boolean removed = mealDayService.delete(dayId);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}