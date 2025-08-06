package com.nutrihouse.patient_service.controller;

import com.nutrihouse.patient_service.dto.VisitaDTO;
import com.nutrihouse.patient_service.service.VisitaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/visite")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'NUTRITIONIST')")
@Tag(name = "Visite", description = "API per la gestione delle visite")
@SecurityRequirement(name = "bearerAuth")
@Slf4j
public class VisitaController {

    private final VisitaService visitaService;

    @Operation(summary = "Crea nuova visita", description = "Crea una nuova visita nel sistema")
    @ApiResponse(responseCode = "201", description = "Visita creata con successo")
    @ApiResponse(responseCode = "400", description = "Dati visita non validi")
    @PostMapping
    public ResponseEntity<VisitaDTO> createVisita(@Valid @RequestBody VisitaDTO visitaDTO) {
        log.info("Richiesta creazione visita per paziente ID: {}", visitaDTO.getPazienteId());
        VisitaDTO created = visitaService.createVisita(visitaDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Ottieni visita per ID", description = "Recupera i dati di una visita specifica")
    @ApiResponse(responseCode = "200", description = "Visita trovata")
    @ApiResponse(responseCode = "404", description = "Visita non trovata")
    @GetMapping("/{id}")
    public ResponseEntity<VisitaDTO> getVisita(
            @Parameter(description = "ID della visita") @PathVariable Long id) {
        log.debug("Richiesta visita ID: {}", id);
        Optional<VisitaDTO> visitaOpt = visitaService.getVisitaById(id);
        return visitaOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Lista tutte le visite", description = "Recupera la lista di tutte le visite")
    @ApiResponse(responseCode = "200", description = "Lista visite recuperata con successo")
    @GetMapping
    public ResponseEntity<List<VisitaDTO>> getAllVisite(
            @Parameter(description = "ID del paziente (opzionale)") @RequestParam(required = false) Long pazienteId,
            @Parameter(description = "Stato della visita (opzionale)") @RequestParam(required = false) String stato) {
        
        log.debug("Richiesta lista visite - pazienteId: {}, stato: {}", pazienteId, stato);
        
        List<VisitaDTO> visite;
        
        if (pazienteId != null) {
            visite = visitaService.getVisiteByPazienteId(pazienteId);
        } else if (stato != null) {
            visite = visitaService.getVisiteByStato(stato);
        } else {
            visite = visitaService.getAllVisite();
        }
        
        return ResponseEntity.ok(visite);
    }

    @Operation(summary = "Aggiorna visita", description = "Aggiorna i dati di una visita esistente")
    @ApiResponse(responseCode = "200", description = "Visita aggiornata con successo")
    @ApiResponse(responseCode = "404", description = "Visita non trovata")
    @PutMapping("/{id}")
    public ResponseEntity<VisitaDTO> updateVisita(
            @Parameter(description = "ID della visita") @PathVariable Long id,
            @Valid @RequestBody VisitaDTO visitaDTO) {
        log.info("Richiesta aggiornamento visita ID: {}", id);
        Optional<VisitaDTO> updatedOpt = visitaService.updateVisita(id, visitaDTO);
        return updatedOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Elimina visita", description = "Elimina una visita dal sistema")
    @ApiResponse(responseCode = "204", description = "Visita eliminata con successo")
    @ApiResponse(responseCode = "404", description = "Visita non trovata")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisita(
            @Parameter(description = "ID della visita") @PathVariable Long id) {
        log.info("Richiesta eliminazione visita ID: {}", id);
        boolean deleted = visitaService.deleteVisita(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Aggiorna stato visita", description = "Aggiorna solo lo stato di una visita")
    @ApiResponse(responseCode = "200", description = "Stato aggiornato con successo")
    @ApiResponse(responseCode = "404", description = "Visita non trovata")
    @PatchMapping("/{id}/stato")
    public ResponseEntity<VisitaDTO> updateStatoVisita(
            @Parameter(description = "ID della visita") @PathVariable Long id,
            @Parameter(description = "Nuovo stato") @RequestParam String stato) {
        log.info("Richiesta aggiornamento stato visita ID: {} a stato: {}", id, stato);
        Optional<VisitaDTO> updatedOpt = visitaService.updateStatoVisita(id, stato);
        return updatedOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Ottieni visite prossime", description = "Recupera le visite programmate nei prossimi giorni")
    @ApiResponse(responseCode = "200", description = "Lista visite prossime")
    @GetMapping("/prossime")
    public ResponseEntity<List<VisitaDTO>> getVisiteProssime(
            @Parameter(description = "Numero di giorni") @RequestParam(defaultValue = "7") int giorni) {
        log.debug("Richiesta visite prossime nei prossimi {} giorni", giorni);
        List<VisitaDTO> visite = visitaService.getVisiteProssime(giorni);
        return ResponseEntity.ok(visite);
    }

    @Operation(summary = "Ottieni visite per paziente", description = "Recupera tutte le visite di un paziente specifico")
    @ApiResponse(responseCode = "200", description =
            "Lista visite recuperata con successo")
    @GetMapping("/paziente/{id}")
    public ResponseEntity<List<VisitaDTO>> getVisiteByPazienteId(
            @Parameter(description = "ID del paziente") @PathVariable Long id) {
        log.debug("Richiesta visite per paziente ID: {}", id);
        List<VisitaDTO> visite = visitaService.getVisiteByPazienteId(id);
        return ResponseEntity.ok(visite);
    }
}