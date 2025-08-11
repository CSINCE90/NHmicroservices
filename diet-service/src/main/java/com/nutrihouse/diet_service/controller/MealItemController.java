package com.nutrihouse.diet_service.controller;

import com.nutrihouse.diet_service.dto.MealItemRequestDTO;
import com.nutrihouse.diet_service.dto.MealItemResponseDTO;
import com.nutrihouse.diet_service.service.MealItemService;
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
@RequestMapping("/api/diets/items")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NUTRITIONIST')")
@Tag(name = "Items del piano", description = "API per la gestione delle righe pasto nei piani alimentari")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class MealItemController {

    private final MealItemService mealItemService;

    @Operation(summary = "Aggiungi item", description = "Aggiunge una nuova riga pasto ad un giorno specifico di un piano")
    @ApiResponse(responseCode = "201", description = "Item creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    @PostMapping("/{dayId}")
    public ResponseEntity<MealItemResponseDTO> addItem(
            @Parameter(description = "ID del giorno") @PathVariable Long dayId,
            @Valid @RequestBody MealItemRequestDTO request) {
        log.info("Aggiunta item al giorno ID: {}", dayId);
        MealItemResponseDTO created = mealItemService.addItem(dayId, request);
        return ResponseEntity.created(URI.create("/api/diets/items/" + created.getId()))
                .body(created);
    }

    @Operation(summary = "Recupera item per ID", description = "Ottiene i dettagli di un singolo item pasto")
    @ApiResponse(responseCode = "200", description = "Item trovato")
    @ApiResponse(responseCode = "404", description = "Item non trovato")
    @GetMapping("/{itemId}")
    public ResponseEntity<MealItemResponseDTO> getItemById(
            @Parameter(description = "ID dell'item") @PathVariable Long itemId) {
        log.debug("Recupero item ID: {}", itemId);
        MealItemResponseDTO dto = mealItemService.getItemById(itemId);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Lista item di un giorno", description = "Recupera tutti gli item di un giorno di un piano")
    @ApiResponse(responseCode = "200", description = "Lista item recuperata")
    @GetMapping("/day/{dayId}")
    public ResponseEntity<List<MealItemResponseDTO>> listItemsByDay(
            @Parameter(description = "ID del giorno") @PathVariable Long dayId) {
        log.debug("Lista item per giorno ID: {}", dayId);
        List<MealItemResponseDTO> list = mealItemService.getItemsByDay(dayId);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Aggiorna item", description = "Aggiorna i dati di una riga pasto")
    @ApiResponse(responseCode = "200", description = "Item aggiornato con successo")
    @ApiResponse(responseCode = "404", description = "Item non trovato")
    @PatchMapping("/{itemId}")
    public ResponseEntity<MealItemResponseDTO> updateItem(
            @Parameter(description = "ID dell'item") @PathVariable Long itemId,
            @Valid @RequestBody MealItemRequestDTO request) {
        log.info("Aggiornamento item ID: {}", itemId);
        MealItemResponseDTO updated = mealItemService.updateItem(itemId, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Elimina item", description = "Elimina una riga pasto da un giorno del piano")
    @ApiResponse(responseCode = "204", description = "Item eliminato con successo")
    @ApiResponse(responseCode = "404", description = "Item non trovato")
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(
            @Parameter(description = "ID dell'item") @PathVariable Long itemId) {
        log.info("Eliminazione item ID: {}", itemId);
        boolean removed = mealItemService.deleteItem(itemId);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}