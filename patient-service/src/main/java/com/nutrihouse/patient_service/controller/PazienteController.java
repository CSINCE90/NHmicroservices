package com.nutrihouse.patient_service.controller;

import com.nutrihouse.patient_service.dto.PazienteDTO;
import com.nutrihouse.patient_service.service.PazienteService;


import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/pazienti")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'NUTRITIONIST')")
public class PazienteController {

    private final PazienteService pazienteService;

    // Create (POST)
    
    @PostMapping("/create")
    public ResponseEntity<PazienteDTO> createPaziente(@RequestBody PazienteDTO pazienteDTO) {
        PazienteDTO created = pazienteService.createPaziente(pazienteDTO);
        return ResponseEntity.ok(created);
    }

    // Update (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<PazienteDTO> updatePaziente(@PathVariable Long id, @RequestBody PazienteDTO pazienteDTO) {
        Optional<PazienteDTO> updatedOpt = pazienteService.updatePaziente(id, pazienteDTO);
        return updatedOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Read by ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<PazienteDTO> getPaziente(@PathVariable Long id) {
        Optional<PazienteDTO> pazienteOpt = pazienteService.getPazienteById(id);
        return pazienteOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Read all (GET)
    @GetMapping
    public ResponseEntity<List<PazienteDTO>> getAllPazienti() {
        List<PazienteDTO> pazienti = pazienteService.getAllPazienti();
        return ResponseEntity.ok(pazienti);
    }

    // Delete (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaziente(@PathVariable Long id) {
        boolean deleted = pazienteService.deletePaziente(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // update, delete, findAll se vuoi CRUD completo!
}