package com.nutrihouse.patient_service.controller;

import com.nutrihouse.patient_service.dto.VisitaDTO;
import com.nutrihouse.patient_service.service.VisitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/visite")
@RequiredArgsConstructor
public class VisitaController {

    private final VisitaService visitaService;

    // Create (POST)
    @PostMapping
    public ResponseEntity<VisitaDTO> createVisita(@RequestBody VisitaDTO visitaDTO) {
        VisitaDTO created = visitaService.createVisita(visitaDTO);
        return ResponseEntity.ok(created);
    }

    // Read by ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<VisitaDTO> getVisita(@PathVariable Long id) {
        Optional<VisitaDTO> visitaOpt = visitaService.getVisitaById(id);
        return visitaOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Read all (GET)
    @GetMapping
    public ResponseEntity<List<VisitaDTO>> getAllVisite() {
        List<VisitaDTO> visite = visitaService.getAllVisite();
        return ResponseEntity.ok(visite);
    }

    // Delete (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisita(@PathVariable Long id) {
        boolean deleted = visitaService.deleteVisita(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<VisitaDTO> updateVisita(@PathVariable Long id, @RequestBody VisitaDTO visitaDTO) {
        Optional<VisitaDTO> updatedOpt = visitaService.updateVisita(id, visitaDTO);
        return updatedOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
