package com.nutrihouse.patient_service.service;

import com.nutrihouse.patient_service.model.Paziente;
import com.nutrihouse.patient_service.repository.PazienteRepository;
import com.nutrihouse.patient_service.dto.PazienteDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
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
@Slf4j
public class PazienteService {

    private final PazienteRepository pazienteRepository;

    @Transactional
    public PazienteDTO createPaziente(PazienteDTO pazienteDTO) {
        log.info("Creazione nuovo paziente: {}", pazienteDTO.getEmail());
        
        // Verifica che l'email non sia già in uso
        if (pazienteRepository.existsByEmail(pazienteDTO.getEmail())) {
            throw new IllegalArgumentException("Email già in uso: " + pazienteDTO.getEmail());
        }
        
        // Imposta automaticamente chi ha creato il paziente
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        pazienteDTO.setCreatedBy(currentUserEmail);
        
        Paziente paziente = toEntity(pazienteDTO);
        Paziente saved = pazienteRepository.save(paziente);
        
        log.info("Paziente creato con successo - ID: {}, creato da: {}", saved.getId(), currentUserEmail);
        return toDTO(saved);
    }

    @Transactional
    public Optional<PazienteDTO> updatePaziente(Long id, PazienteDTO pazienteDTO) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Aggiornamento paziente ID: {} da parte di: {}", id, currentUserEmail);
        
        return pazienteRepository.findByIdAndCreatedBy(id, currentUserEmail)
                .map(existing -> {
                    // Verifica email univoca se è cambiata
                    if (!existing.getEmail().equals(pazienteDTO.getEmail()) &&
                        pazienteRepository.existsByEmail(pazienteDTO.getEmail())) {
                        throw new IllegalArgumentException("Email già in uso: " + pazienteDTO.getEmail());
                    }
                    
                    // Mantieni il createdBy originale (non deve cambiare)
                    pazienteDTO.setCreatedBy(existing.getCreatedBy());
                    
                    updateEntityFromDTO(existing, pazienteDTO);
                    Paziente updated = pazienteRepository.save(existing);
                    
                    log.info("Paziente aggiornato con successo - ID: {}", id);
                    return toDTO(updated);
                });
    }

    @Transactional(readOnly = true)
    public Optional<PazienteDTO> getPazienteById(Long id) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        log.debug("Richiesta paziente ID: {} da parte di: {}", id, currentUserEmail);
        
        return pazienteRepository.findByIdAndCreatedBy(id, currentUserEmail)
                .map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<PazienteDTO> getAllPazienti() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        log.debug("Richiesta lista pazienti da parte di: {}", currentUserEmail);
        
        return pazienteRepository.findByCreatedByOrderByDataCreazioneDesc(currentUserEmail)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PazienteDTO> searchPazienti(String searchTerm) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        log.debug("Ricerca pazienti '{}' da parte di: {}", searchTerm, currentUserEmail);
        
        return pazienteRepository.searchPazientiByUser(currentUserEmail, searchTerm)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deletePaziente(Long id) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Eliminazione paziente ID: {} da parte di: {}", id, currentUserEmail);
        
        Optional<Paziente> pazienteOpt = pazienteRepository.findByIdAndCreatedBy(id, currentUserEmail);
        
        if (pazienteOpt.isPresent()) {
            pazienteRepository.deleteById(id);
            log.info("Paziente eliminato con successo - ID: {}", id);
            return true;
        } else {
            log.warn("Tentativo di eliminazione paziente non autorizzato - ID: {}, Utente: {}", id, currentUserEmail);
            return false;
        }
    }

    @Transactional(readOnly = true)
    public com.nutrihouse.patient_service.controller.PazienteController.PazienteStatsDTO getStatistiche() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        log.debug("Richiesta statistiche da parte di: {}", currentUserEmail);
        
        // Statistiche solo sui pazienti dell'utente corrente
        List<Paziente> pazienti = pazienteRepository.findByCreatedByOrderByDataCreazioneDesc(currentUserEmail);

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

    // Metodo per verificare se un paziente è di proprietà dell'utente corrente
    // (utile per altri servizi)
    public boolean isPazienteOwnedByCurrentUser(Long pazienteId) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return pazienteRepository.findByIdAndCreatedBy(pazienteId, currentUserEmail).isPresent();
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
        dto.setCreatedBy(entity.getCreatedBy());
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
                .createdBy(dto.getCreatedBy())
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
        // NON aggiornare createdBy per sicurezza
        
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