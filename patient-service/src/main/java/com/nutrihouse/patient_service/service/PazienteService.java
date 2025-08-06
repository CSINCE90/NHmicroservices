package com.nutrihouse.patient_service.service;

import com.nutrihouse.patient_service.model.Paziente;
import com.nutrihouse.patient_service.repository.PazienteRepository;
import com.nutrihouse.patient_service.dto.PazienteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PazienteService {

    private final PazienteRepository pazienteRepository;

    @Transactional
    public com.nutrihouse.patient_service.controller.PazienteController.PazienteStatsDTO getStatistiche() {
        List<Paziente> pazienti = pazienteRepository.findAll();

        long totale = pazienti.size();
        long maschi = pazienti.stream()
                .map(Paziente::getSesso)
                .filter(s -> s != null && s.equalsIgnoreCase("M"))
                .count();
        long femmine = pazienti.stream()
                .map(Paziente::getSesso)
                .filter(s -> s != null && s.equalsIgnoreCase("F"))
                .count();

        LocalDate today = LocalDate.now();
        double etaMedia = pazienti.stream()
                .map(Paziente::getDataNascita)
                .filter(d -> d != null)
                .mapToInt(d -> Period.between(d, today).getYears())
                .average()
                .orElse(0.0);

        LocalDateTime limiteRecenti = LocalDateTime.now().minusDays(30);
        long recenti = pazienti.stream()
                .map(Paziente::getDataCreazione)
                .filter(dc -> dc != null && dc.isAfter(limiteRecenti))
                .count();

        return com.nutrihouse.patient_service.controller.PazienteController.PazienteStatsDTO.builder()
                .totalePazienti(totale)
                .maschi(maschi)
                .femmine(femmine)
                .etaMedia(etaMedia)
                .pazientiRecenti(recenti)
                .build();
    }

    @Transactional
    public PazienteDTO createPaziente(PazienteDTO pazienteDTO) {
        // Verifica che l'email non sia già in uso
        if (pazienteRepository.existsByEmail(pazienteDTO.getEmail())) {
            throw new IllegalArgumentException("Email già in uso: " + pazienteDTO.getEmail());
        }
        
        Paziente paziente = toEntity(pazienteDTO);
        Paziente saved = pazienteRepository.save(paziente);
        return toDTO(saved);
    }

    @Transactional
    public Optional<PazienteDTO> updatePaziente(Long id, PazienteDTO pazienteDTO) {
        return pazienteRepository.findById(id).map(existing -> {
            // Verifica email univoca se è cambiata
            if (!existing.getEmail().equals(pazienteDTO.getEmail()) &&
                pazienteRepository.existsByEmail(pazienteDTO.getEmail())) {
                throw new IllegalArgumentException("Email già in uso: " + pazienteDTO.getEmail());
            }
            
            updateEntityFromDTO(existing, pazienteDTO);
            Paziente updated = pazienteRepository.save(existing);
            return toDTO(updated);
        });
    }

    @Transactional(readOnly = true)
    public Optional<PazienteDTO> getPazienteById(Long id) {
        return pazienteRepository.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<PazienteDTO> getAllPazienti() {
        return pazienteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PazienteDTO> searchPazienti(String searchTerm) {
        return pazienteRepository.findByNomeContainingIgnoreCaseOrCognomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
                searchTerm, searchTerm, searchTerm)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deletePaziente(Long id) {
        if (pazienteRepository.existsById(id)) {
            pazienteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // --- Mapping methods ---
    private PazienteDTO toDTO(Paziente entity) {
        PazienteDTO dto = new PazienteDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setCognome(entity.getCognome());
        dto.setDataNascita(entity.getDataNascita());
        dto.setSesso(entity.getSesso());
        dto.setEmail(entity.getEmail());
        dto.setTelefono(entity.getTelefono());
        dto.setAltezza(entity.getAltezza());
        dto.setPeso(entity.getPeso());
        dto.setObiettivo(entity.getObiettivo());
        dto.setNote(entity.getNote());
        dto.setDataCreazione(entity.getDataCreazione());
        dto.setDataModifica(entity.getDataModifica());
        
        // Retrocompatibilità
        dto.setFullName(entity.getFullName());
        dto.setCodiceFiscale(entity.getCodiceFiscale());
        dto.setIndirizzo(entity.getIndirizzo());
        
        return dto;
    }

    private Paziente toEntity(PazienteDTO dto) {
        return Paziente.builder()
                .id(dto.getId())
                .nome(dto.getNome())
                .cognome(dto.getCognome())
                .dataNascita(dto.getDataNascita())
                .sesso(dto.getSesso())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .altezza(dto.getAltezza())
                .peso(dto.getPeso())
                .obiettivo(dto.getObiettivo())
                .note(dto.getNote())
                // Retrocompatibilità
                .fullName(dto.getFullName())
                .codiceFiscale(dto.getCodiceFiscale())
                .indirizzo(dto.getIndirizzo())
                .build();
    }

    private void updateEntityFromDTO(Paziente entity, PazienteDTO dto) {
        entity.setNome(dto.getNome());
        entity.setCognome(dto.getCognome());
        entity.setDataNascita(dto.getDataNascita());
        entity.setSesso(dto.getSesso());
        entity.setEmail(dto.getEmail());
        entity.setTelefono(dto.getTelefono());
        entity.setAltezza(dto.getAltezza());
        entity.setPeso(dto.getPeso());
        entity.setObiettivo(dto.getObiettivo());
        entity.setNote(dto.getNote());
        
        // Retrocompatibilità
        if (dto.getFullName() != null) {
            entity.setFullName(dto.getFullName());
        }
        if (dto.getCodiceFiscale() != null) {
            entity.setCodiceFiscale(dto.getCodiceFiscale());
        }
        if (dto.getIndirizzo() != null) {
            entity.setIndirizzo(dto.getIndirizzo());
        }
    }
}