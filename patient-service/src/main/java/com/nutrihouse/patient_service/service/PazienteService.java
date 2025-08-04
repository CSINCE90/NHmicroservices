package com.nutrihouse.patient_service.service;

import com.nutrihouse.patient_service.model.Paziente;
import com.nutrihouse.patient_service.repository.PazienteRepository;
import com.nutrihouse.patient_service.dto.PazienteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PazienteService {

    private final PazienteRepository pazienteRepository;

    public PazienteDTO createPaziente(PazienteDTO pazienteDTO) {
        Paziente paziente = toEntity(pazienteDTO);
        Paziente saved = pazienteRepository.save(paziente);
        return toDTO(saved);
    }

   public Optional<PazienteDTO> updatePaziente(Long id, PazienteDTO pazienteDTO) {
    return pazienteRepository.findById(id).map(existing -> {
        existing.setFullName(pazienteDTO.getFullName());
        existing.setEmail(pazienteDTO.getEmail());
        existing.setTelefono(pazienteDTO.getTelefono());
        existing.setIndirizzo(pazienteDTO.getIndirizzo());
        existing.setDataNascita(pazienteDTO.getDataNascita());
        // aggiorna altri campi se necessario

        Paziente updated = pazienteRepository.save(existing);
        return toDTO(updated);
    });
}

    public Optional<PazienteDTO> getPazienteById(Long id) {
        return pazienteRepository.findById(id).map(this::toDTO);
    }

    public List<PazienteDTO> getAllPazienti() {
        return pazienteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public boolean deletePaziente(Long id) {
        if (pazienteRepository.existsById(id)) {
            pazienteRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Eventuali metodi update/delete...

    // --- Mapping methods ---
    private PazienteDTO toDTO(Paziente entity) {
        PazienteDTO dto = new PazienteDTO();
        dto.setId(entity.getId());
        dto.setFullName(entity.getFullName());
        dto.setEmail(entity.getEmail());
        dto.setCodiceFiscale(entity.getCodiceFiscale());
        dto.setDataNascita(entity.getDataNascita());
        dto.setTelefono(entity.getTelefono());
        dto.setIndirizzo(entity.getIndirizzo());
        return dto;
    }

    private Paziente toEntity(PazienteDTO dto) {
        return Paziente.builder()
                .id(dto.getId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .codiceFiscale(dto.getCodiceFiscale())
                .dataNascita(dto.getDataNascita())
                .telefono(dto.getTelefono())
                .indirizzo(dto.getIndirizzo())
                .build();
    }


}