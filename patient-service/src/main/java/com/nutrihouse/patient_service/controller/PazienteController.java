package com.nutrihouse.patient_service.controller;

import com.nutrihouse.patient_service.dto.PazienteDTO;
import com.nutrihouse.patient_service.service.PazienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pazienti")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'NUTRITIONIST')")
@Tag(name = "Pazienti", description = "API per la gestione dei pazienti")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class PazienteController {

    private final PazienteService pazienteService;

    @Operation(summary = "Crea nuovo paziente", description = "Crea un nuovo paziente nel sistema")
    @ApiResponse(responseCode = "201", description = "Paziente creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati paziente non validi")
    @PostMapping
    public ResponseEntity<PazienteDTO> createPaziente(
            @Valid @RequestBody PazienteDTO pazienteDTO) {
        
        log.info("Creazione nuovo paziente: {}", pazienteDTO.getEmail());
        PazienteDTO created = pazienteService.createPaziente(pazienteDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Aggiorna paziente", description = "Aggiorna i dati di un paziente esistente")
    @ApiResponse(responseCode = "200", description = "Paziente aggiornato con successo")
    @ApiResponse(responseCode = "404", description = "Paziente non trovato")
    @PutMapping("/{id}")
    public ResponseEntity<PazienteDTO> updatePaziente(
            @Parameter(description = "ID del paziente") @PathVariable Long id,
            @Valid @RequestBody PazienteDTO pazienteDTO) {
        
        log.info("Aggiornamento paziente ID: {}", id);
        Optional<PazienteDTO> updatedOpt = pazienteService.updatePaziente(id, pazienteDTO);
        return updatedOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Ottieni paziente per ID", description = "Recupera i dati di un paziente specifico")
    @ApiResponse(responseCode = "200", description = "Paziente trovato")
    @ApiResponse(responseCode = "404", description = "Paziente non trovato")
    @GetMapping("/{id}")
    public ResponseEntity<PazienteDTO> getPaziente(
            @Parameter(description = "ID del paziente") @PathVariable Long id) {
        
        log.debug("Richiesta paziente ID: {}", id);
        Optional<PazienteDTO> pazienteOpt = pazienteService.getPazienteById(id);
        return pazienteOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Lista tutti i pazienti", description = "Recupera la lista di tutti i pazienti")
    @ApiResponse(responseCode = "200", description = "Lista pazienti recuperata con successo")
    @GetMapping
    public ResponseEntity<List<PazienteDTO>> getAllPazienti(
            @Parameter(description = "Termine di ricerca") @RequestParam(required = false) String search,
            @Parameter(description = "Pagina") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Dimensione pagina") @RequestParam(defaultValue = "50") int size,
            @Parameter(description = "Campo ordinamento") @RequestParam(defaultValue = "nome") String sortBy,
            @Parameter(description = "Direzione ordinamento") @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.debug("Richiesta lista pazienti - search: {}, page: {}, size: {}", search, page, size);
        
        if (search != null && !search.trim().isEmpty()) {
            List<PazienteDTO> searchResults = pazienteService.searchPazienti(search.trim());
            return ResponseEntity.ok(searchResults);
        }
        
        List<PazienteDTO> pazienti = pazienteService.getAllPazienti();
        return ResponseEntity.ok(pazienti);
    }

    @Operation(summary = "Elimina paziente", description = "Elimina un paziente dal sistema")
    @ApiResponse(responseCode = "204", description = "Paziente eliminato con successo")
    @ApiResponse(responseCode = "404", description = "Paziente non trovato")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaziente(
            @Parameter(description = "ID del paziente") @PathVariable Long id) {
        
        log.info("Eliminazione paziente ID: {}", id);
        boolean deleted = pazienteService.deletePaziente(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Cerca pazienti", description = "Cerca pazienti per nome, cognome o email")
    @ApiResponse(responseCode = "200", description = "Risultati ricerca")
    @GetMapping("/search")
    public ResponseEntity<List<PazienteDTO>> searchPazienti(
            @Parameter(description = "Termine di ricerca") @RequestParam String q) {
        
        log.debug("Ricerca pazienti: {}", q);
        List<PazienteDTO> results = pazienteService.searchPazienti(q);
        return ResponseEntity.ok(results);
    }

    @Operation(summary = "Statistiche pazienti", description = "Recupera statistiche sui pazienti")
    @ApiResponse(responseCode = "200", description = "Statistiche recuperate")
    @GetMapping("/stats")
    public ResponseEntity<PazienteStatsDTO> getStats() {
        log.debug("Richiesta statistiche pazienti");
        PazienteStatsDTO stats = pazienteService.getStatistiche();
        return ResponseEntity.ok(stats);
    }

    // DTO per le statistiche
    @lombok.Data
    @lombok.Builder
    public static class PazienteStatsDTO {
        private long totalePazienti;
        private long maschi;
        private long femmine;
        private double etaMedia;
        private long pazientiRecenti; // ultimi 30 giorni
    }
}