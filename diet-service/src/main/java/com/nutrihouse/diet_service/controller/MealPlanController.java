package com.nutrihouse.diet_service.controller;

import com.nutrihouse.diet_service.dto.MealPlanRequestDTO;
import com.nutrihouse.diet_service.dto.MealDayResponseDTO;
import com.nutrihouse.diet_service.dto.MealPlanResponseDTO;
import com.nutrihouse.diet_service.service.MealPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/diets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NUTRITIONIST')")
@Tag(name = "Piani alimentari", description = "API per la gestione dei piani alimentari")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class MealPlanController {

    private final MealPlanService mealPlanService;

    // =====================
    // PIANI ALIMENTARI
    // =====================

    @Operation(summary = "Crea nuovo piano alimentare", description = "Crea un nuovo piano alimentare per un paziente")
    @ApiResponse(responseCode = "201", description = "Piano creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati piano non validi")
    @PostMapping
    public ResponseEntity<MealPlanResponseDTO> create(@Valid @RequestBody MealPlanRequestDTO request) {
        log.info("Creazione nuovo piano per pazienteId: {} - titolo: {}", request.getPazienteId(), request.getTitolo());
        MealPlanResponseDTO created = mealPlanService.createPlan(request);
        return ResponseEntity.created(URI.create("/api/diets/" + created.getId())).body(created);
    }

    @Operation(summary = "Ottieni piano per ID", description = "Recupera un piano alimentare specifico")
    @ApiResponse(responseCode = "200", description = "Piano trovato")
    @ApiResponse(responseCode = "404", description = "Piano non trovato")
    @GetMapping("/{planId}")
    public ResponseEntity<MealPlanResponseDTO> getById(
            @Parameter(description = "ID del piano") @PathVariable Long planId) {
        log.debug("Richiesta piano ID: {}", planId);
        MealPlanResponseDTO dto = mealPlanService.getPlan(planId);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Lista piani per paziente", description = "Recupera tutti i piani di un determinato paziente")
    @ApiResponse(responseCode = "200", description = "Lista piani recuperata")
    @GetMapping("/paziente/{pazienteId}")
    public ResponseEntity<List<MealPlanResponseDTO>> listByPaziente(
            @Parameter(description = "ID del paziente") @PathVariable Long pazienteId) {
        log.debug("Lista piani per pazienteId: {}", pazienteId);
        List<MealPlanResponseDTO> list = mealPlanService.getPlansByPaziente(pazienteId);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Aggiorna header piano", description = "Aggiorna titolo e note dell'header di un piano alimentare")
    @ApiResponse(responseCode = "200", description = "Piano aggiornato con successo")
    @ApiResponse(responseCode = "404", description = "Piano non trovato")
    @PatchMapping("/{planId}")
    public ResponseEntity<MealPlanResponseDTO> updateHeader(
            @Parameter(description = "ID del piano") @PathVariable Long planId,
            @RequestParam(required = false) String titolo,
            @RequestParam(required = false) String note) {
        log.info("Update header piano ID: {} - nuovo titolo: {}", planId, titolo);
        MealPlanResponseDTO dto = mealPlanService.updateHeader(planId, titolo, note);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Elimina piano", description = "Elimina un piano alimentare e i relativi giorni e items")
    @ApiResponse(responseCode = "204", description = "Piano eliminato con successo")
    @ApiResponse(responseCode = "404", description = "Piano non trovato")
    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del piano") @PathVariable Long planId) {
        log.info("Eliminazione piano ID: {}", planId);
        boolean removed = mealPlanService.deletePlan(planId);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // =====================
    // GIORNI (solo add/get annidato sotto il piano)
    // =====================

    @Operation(summary = "Aggiungi o ottieni giorno", description = "Aggiunge o recupera un giorno identificato da dayIndex")
    @ApiResponse(responseCode = "200", description = "Giorno aggiunto o recuperato con successo")
    @PostMapping("/{planId}/days/{dayIndex}")
    public ResponseEntity<MealDayResponseDTO> addOrGetDay(
            @Parameter(description = "ID del piano") @PathVariable Long planId,
            @Parameter(description = "Indice del giorno (1..7)") @PathVariable Integer dayIndex) {
        log.debug("Add/Get giorno {} per piano {}", dayIndex, planId);
        MealDayResponseDTO dto = mealPlanService.addOrGetDay(planId, dayIndex);
        return ResponseEntity.ok(dto);
    }
}