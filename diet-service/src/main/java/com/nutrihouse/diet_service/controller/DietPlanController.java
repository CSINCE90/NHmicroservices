package com.nutrihouse.diet_service.controller;

import com.nutrihouse.diet_service.dto.*;
import com.nutrihouse.diet_service.model.MealType;
import com.nutrihouse.diet_service.service.DietPlanService;
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
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/diet-plans")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NUTRITIONIST')")
@Tag(name = "Piani Alimentari", description = "API per la gestione dei piani alimentari")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DietPlanController {

    private final DietPlanService dietPlanService;

    // ==================== CRUD Operations ====================

    @Operation(summary = "Crea nuovo elemento del piano", 
              description = "Aggiunge un nuovo alimento al piano alimentare")
    @ApiResponse(responseCode = "201", description = "Elemento creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi o elemento duplicato")
    @PostMapping
    public ResponseEntity<DietPlanResponseDTO> create(@Valid @RequestBody DietPlanRequestDTO request) {
        log.info("Creazione nuovo elemento piano: {}", request.getTitle());
        DietPlanResponseDTO created = dietPlanService.create(request);
        return ResponseEntity.created(URI.create("/api/diet-plans/" + created.getId())).body(created);
    }

    @Operation(summary = "Recupera elemento per ID", 
              description = "Ottiene i dettagli di un singolo elemento del piano")
    @ApiResponse(responseCode = "200", description = "Elemento trovato")
    @ApiResponse(responseCode = "404", description = "Elemento non trovato")
    @GetMapping("/{id}")
    public ResponseEntity<DietPlanResponseDTO> findById(
            @Parameter(description = "ID dell'elemento") @PathVariable Long id) {
        log.debug("Recupero elemento con ID: {}", id);
        return ResponseEntity.ok(dietPlanService.findById(id));
    }

    @Operation(summary = "Aggiorna elemento", 
              description = "Modifica i dati di un elemento esistente del piano")
    @ApiResponse(responseCode = "200", description = "Elemento aggiornato con successo")
    @ApiResponse(responseCode = "404", description = "Elemento non trovato")
    @PutMapping("/{id}")
    public ResponseEntity<DietPlanResponseDTO> update(
            @Parameter(description = "ID dell'elemento") @PathVariable Long id,
            @Valid @RequestBody DietPlanUpdateDTO request) {
        log.info("Aggiornamento elemento ID: {}", id);
        return ResponseEntity.ok(dietPlanService.update(id, request));
    }

    @Operation(summary = "Elimina elemento", 
              description = "Rimuove un singolo elemento dal piano (soft delete)")
    @ApiResponse(responseCode = "204", description = "Elemento eliminato con successo")
    @ApiResponse(responseCode = "404", description = "Elemento non trovato")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @Parameter(description = "ID dell'elemento") @PathVariable Long id) {
        log.info("Eliminazione elemento ID: {}", id);
        dietPlanService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Plan Operations ====================

    @Operation(summary = "Recupera piano completo", 
              description = "Ottiene tutti gli elementi di un piano alimentare")
    @ApiResponse(responseCode = "200", description = "Piano recuperato con successo")
    @GetMapping("/patient/{patientId}/plan/{title}")
    public ResponseEntity<List<DietPlanResponseDTO>> getPlan(
            @Parameter(description = "ID del paziente") @PathVariable Long patientId,
            @Parameter(description = "Titolo del piano") @PathVariable String title) {
        log.debug("Recupero piano '{}' per paziente {}", title, patientId);
        return ResponseEntity.ok(dietPlanService.findPlanItems(patientId, title));
    }

    @Operation(summary = "Riepilogo piano", 
              description = "Ottiene un riepilogo completo con statistiche nutrizionali")
    @ApiResponse(responseCode = "200", description = "Riepilogo generato con successo")
    @GetMapping("/patient/{patientId}/plan/{title}/summary")
    public ResponseEntity<DietPlanSummaryDTO> getPlanSummary(
            @Parameter(description = "ID del paziente") @PathVariable Long patientId,
            @Parameter(description = "Titolo del piano") @PathVariable String title) {
        log.info("Generazione riepilogo per piano '{}' del paziente {}", title, patientId);
        return ResponseEntity.ok(dietPlanService.getPlanSummary(patientId, title));
    }

    @Operation(summary = "Lista titoli piani", 
              description = "Recupera tutti i titoli dei piani di un paziente")
    @ApiResponse(responseCode = "200", description = "Lista recuperata con successo")
    @GetMapping("/patient/{patientId}/titles")
    public ResponseEntity<List<String>> getPlanTitles(
            @Parameter(description = "ID del paziente") @PathVariable Long patientId) {
        log.debug("Recupero titoli piani per paziente {}", patientId);
        return ResponseEntity.ok(dietPlanService.getPlanTitles(patientId));
    }

    @Operation(summary = "Elimina piano completo", 
              description = "Rimuove tutti gli elementi di un piano (soft delete)")
    @ApiResponse(responseCode = "204", description = "Piano eliminato con successo")
    @DeleteMapping("/patient/{patientId}/plan/{title}")
    public ResponseEntity<Void> deletePlan(
            @Parameter(description = "ID del paziente") @PathVariable Long patientId,
            @Parameter(description = "Titolo del piano") @PathVariable String title) {
        log.info("Eliminazione piano '{}' per paziente {}", title, patientId);
        dietPlanService.deletePlan(patientId, title);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Duplica piano", 
              description = "Crea una copia di un piano esistente con nuovo titolo")
    @ApiResponse(responseCode = "201", description = "Piano duplicato con successo")
    @ApiResponse(responseCode = "400", description = "Titolo già esistente")
    @ApiResponse(responseCode = "404", description = "Piano sorgente non trovato")
    @PostMapping("/patient/{patientId}/plan/{sourceTitle}/duplicate")
    public ResponseEntity<List<DietPlanResponseDTO>> duplicatePlan(
            @Parameter(description = "ID del paziente") @PathVariable Long patientId,
            @Parameter(description = "Titolo del piano da duplicare") @PathVariable String sourceTitle,
            @Parameter(description = "Nuovo titolo") @RequestParam String newTitle) {
        log.info("Duplicazione piano '{}' con titolo '{}'", sourceTitle, newTitle);
        List<DietPlanResponseDTO> duplicated = dietPlanService.duplicatePlan(patientId, sourceTitle, newTitle);
        return ResponseEntity.status(HttpStatus.CREATED).body(duplicated);
    }

    // ==================== Query Operations ====================

    @Operation(summary = "Recupera per giorno", 
              description = "Ottiene tutti gli elementi di un giorno specifico")
    @ApiResponse(responseCode = "200", description = "Elementi recuperati con successo")
    @GetMapping("/patient/{patientId}/plan/{title}/day/{dayOfWeek}")
    public ResponseEntity<List<DietPlanResponseDTO>> getByDay(
            @Parameter(description = "ID del paziente") @PathVariable Long patientId,
            @Parameter(description = "Titolo del piano") @PathVariable String title,
            @Parameter(description = "Giorno della settimana (1-7)") @PathVariable Integer dayOfWeek) {
        log.debug("Recupero elementi del giorno {} per piano '{}'", dayOfWeek, title);
        return ResponseEntity.ok(dietPlanService.findByDay(patientId, title, dayOfWeek));
    }

    @Operation(summary = "Recupera per tipo pasto", 
              description = "Ottiene tutti gli elementi di un tipo di pasto specifico")
    @ApiResponse(responseCode = "200", description = "Elementi recuperati con successo")
    @GetMapping("/patient/{patientId}/plan/{title}/meal-type/{mealType}")
    public ResponseEntity<List<DietPlanResponseDTO>> getByMealType(
            @Parameter(description = "ID del paziente") @PathVariable Long patientId,
            @Parameter(description = "Titolo del piano") @PathVariable String title,
            @Parameter(description = "Tipo di pasto") @PathVariable MealType mealType) {
        log.debug("Recupero elementi {} per piano '{}'", mealType, title);
        return ResponseEntity.ok(dietPlanService.findByMealType(patientId, title, mealType));
    }

    // ==================== Batch Operations ====================

    @Operation(summary = "Crea elementi in batch", 
              description = "Aggiunge multipli elementi al piano in una singola operazione")
    @ApiResponse(responseCode = "201", description = "Elementi creati con successo")
    @ApiResponse(responseCode = "207", description = "Alcuni elementi creati, altri falliti")
    @PostMapping("/batch")
    public ResponseEntity<List<DietPlanResponseDTO>> createBatch(
            @Valid @RequestBody List<DietPlanRequestDTO> requests) {
        log.info("Creazione batch di {} elementi", requests.size());
        
        List<DietPlanResponseDTO> created = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (DietPlanRequestDTO request : requests) {
            try {
                created.add(dietPlanService.create(request));
            } catch (Exception e) {
                errors.add("Errore per " + request.getFoodName() + ": " + e.getMessage());
                log.error("Errore nella creazione batch", e);
            }
        }
        
        if (!errors.isEmpty() && created.isEmpty()) {
            return ResponseEntity.badRequest().build();
        } else if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(created);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Elimina elementi in batch", 
              description = "Rimuove multipli elementi dal piano")
    @ApiResponse(responseCode = "204", description = "Elementi eliminati con successo")
    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteBatch(
            @Parameter(description = "Lista di ID da eliminare") @RequestBody List<Long> ids) {
        log.info("Eliminazione batch di {} elementi", ids.size());
        
        for (Long id : ids) {
            try {
                dietPlanService.deleteItem(id);
            } catch (Exception e) {
                log.error("Errore nell'eliminazione dell'elemento {}", id, e);
            }
        }
        
        return ResponseEntity.noContent().build();
    }
}