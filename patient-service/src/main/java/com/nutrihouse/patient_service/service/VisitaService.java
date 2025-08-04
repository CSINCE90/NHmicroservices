package com.nutrihouse.patient_service.service;

import com.nutrihouse.patient_service.model.Visita;
import com.nutrihouse.patient_service.model.Paziente;
import com.nutrihouse.patient_service.dto.VisitaDTO;
import com.nutrihouse.patient_service.repository.VisitaRepository;
import com.nutrihouse.patient_service.repository.PazienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitaService {

    private final VisitaRepository visitaRepository;
    private final PazienteRepository pazienteRepository;

    public VisitaDTO createVisita(VisitaDTO visitaDTO) {
        Paziente paziente = pazienteRepository.findById(visitaDTO.getPazienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paziente non trovato"));

        Visita visita = toEntity(visitaDTO, paziente);
        Visita saved = visitaRepository.save(visita);
        return toDTO(saved);
    }

    public Optional<VisitaDTO> getVisitaById(Long id) {
        return visitaRepository.findById(id).map(this::toDTO);
    }

    public List<VisitaDTO> getAllVisite() {
        return visitaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public boolean deleteVisita(Long id) {
        if (visitaRepository.existsById(id)) {
            visitaRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public Optional<VisitaDTO> updateVisita(Long id, VisitaDTO visitaDTO) {
        return visitaRepository.findById(id).map(existing -> {
            existing.setData(visitaDTO.getData());
            existing.setAnamnesi(visitaDTO.getAnamnesi());
            // Se vuoi aggiornare il paziente associato, puoi gestirlo qui (opzionale)
            Visita updated = visitaRepository.save(existing);
            return toDTO(updated);
        });
    }

    // --- Mapping methods ---
    private VisitaDTO toDTO(Visita entity) {
        VisitaDTO dto = new VisitaDTO();
        dto.setId(entity.getId());
        dto.setData(entity.getData());
        dto.setAnamnesi(entity.getAnamnesi());
        dto.setPazienteId(entity.getPaziente().getId());
        return dto;
    }

    private Visita toEntity(VisitaDTO dto, Paziente paziente) {
        return Visita.builder()
                .id(dto.getId())
                .data(dto.getData())
                .anamnesi(dto.getAnamnesi())
                .paziente(paziente)
                .build();
    }
}