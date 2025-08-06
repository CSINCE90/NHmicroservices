package com.nutrihouse.patient_service.service;

import com.nutrihouse.patient_service.model.Visita;
import com.nutrihouse.patient_service.model.Paziente;
import com.nutrihouse.patient_service.dto.VisitaDTO;
import com.nutrihouse.patient_service.repository.VisitaRepository;
import com.nutrihouse.patient_service.repository.PazienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitaService {

    private final VisitaRepository visitaRepository;
    private final PazienteRepository pazienteRepository;

    @Transactional
    public VisitaDTO createVisita(VisitaDTO visitaDTO) {
        log.info("Creazione nuova visita per paziente ID: {}", visitaDTO.getPazienteId());
        
        Paziente paziente = pazienteRepository.findById(visitaDTO.getPazienteId())
                .orElseThrow(() -> new IllegalArgumentException("Paziente non trovato con ID: " + visitaDTO.getPazienteId()));

        // Validazioni business
        validateVisitaData(visitaDTO, paziente);

        Visita visita = toEntity(visitaDTO, paziente);
        Visita saved = visitaRepository.save(visita);
        
        log.info("Visita creata con successo, ID: {}", saved.getId());
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public Optional<VisitaDTO> getVisitaById(Long id) {
        log.debug("Ricerca visita con ID: {}", id);
        return visitaRepository.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<VisitaDTO> getAllVisite() {
        log.debug("Recupero tutte le visite");
        return visitaRepository.findAllWithPaziente()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VisitaDTO> getVisiteByPazienteId(Long pazienteId) {
        log.debug("Recupero visite per paziente ID: {}", pazienteId);
        
        // Verifica che il paziente esista
        if (!pazienteRepository.existsById(pazienteId)) {
            throw new IllegalArgumentException("Paziente non trovato con ID: " + pazienteId);
        }
        
        return visitaRepository.findByPazienteIdOrderByDataVisitaDesc(pazienteId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VisitaDTO> getVisiteByStato(String stato) {
        log.debug("Recupero visite con stato: {}", stato);
        
        try {
            Visita.StatoVisita statoEnum = Visita.StatoVisita.valueOf(stato.toUpperCase());
            return visitaRepository.findByStatoOrderByDataVisitaAsc(statoEnum)
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            log.warn("Stato visita non valido: {}", stato);
            return List.of();
        }
    }

    @Transactional(readOnly = true)
    public List<VisitaDTO> getVisiteProssime(int giorni) {
        log.debug("Recupero visite prossime nei prossimi {} giorni", giorni);
        
        LocalDateTime ora = LocalDateTime.now();
        LocalDateTime limite = ora.plusDays(giorni);
        
        return visitaRepository.findByDataVisitaBetweenAndStatoOrderByDataVisitaAsc(
                ora, limite, Visita.StatoVisita.PROGRAMMATA)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deleteVisita(Long id) {
        log.info("Eliminazione visita ID: {}", id);
        
        if (visitaRepository.existsById(id)) {
            visitaRepository.deleteById(id);
            log.info("Visita eliminata con successo, ID: {}", id);
            return true;
        } else {
            log.warn("Tentativo di eliminazione visita non esistente, ID: {}", id);
            return false;
        }
    }

    @Transactional
    public Optional<VisitaDTO> updateVisita(Long id, VisitaDTO visitaDTO) {
        log.info("Aggiornamento visita ID: {}", id);
        
        return visitaRepository.findById(id).map(existing -> {
            // Se cambia il paziente, verifica che esista
            if (!existing.getPaziente().getId().equals(visitaDTO.getPazienteId())) {
                Paziente nuovoPaziente = pazienteRepository.findById(visitaDTO.getPazienteId())
                        .orElseThrow(() -> new IllegalArgumentException("Paziente non trovato con ID: " + visitaDTO.getPazienteId()));
                existing.setPaziente(nuovoPaziente);
            }
            
            // Validazioni business
            validateVisitaData(visitaDTO, existing.getPaziente());
            
            // Aggiorna i campi
            updateEntityFromDTO(existing, visitaDTO);
            
            Visita updated = visitaRepository.save(existing);
            log.info("Visita aggiornata con successo, ID: {}", id);
            return toDTO(updated);
        });
    }

    @Transactional
    public Optional<VisitaDTO> updateStatoVisita(Long id, String nuovoStato) {
        log.info("Aggiornamento stato visita ID: {} a stato: {}", id, nuovoStato);
        
        try {
            Visita.StatoVisita statoEnum = Visita.StatoVisita.valueOf(nuovoStato.toUpperCase());
            
            return visitaRepository.findById(id).map(visita -> {
                visita.setStato(statoEnum);
                Visita updated = visitaRepository.save(visita);
                log.info("Stato visita aggiornato con successo, ID: {}, nuovo stato: {}", id, nuovoStato);
                return toDTO(updated);
            });
        } catch (IllegalArgumentException e) {
            log.error("Stato visita non valido: {}", nuovoStato);
            throw new IllegalArgumentException("Stato visita non valido: " + nuovoStato);
        }
    }

    // --- Metodi di validazione ---
    private void validateVisitaData(VisitaDTO visitaDTO, Paziente paziente) {
        // Validazione: non permettere visite duplicate nello stesso momento
        if (visitaRepository.existsByPazienteAndDataVisita(paziente, visitaDTO.getDataVisita())) {
            throw new IllegalArgumentException("Esiste già una visita per questo paziente alla data/ora specificata");
        }

        // Validazione: se la visita è nel passato, deve essere COMPLETATA o ANNULLATA
        if (visitaDTO.getDataVisita().isBefore(LocalDateTime.now()) && 
            "PROGRAMMATA".equals(visitaDTO.getStato())) {
            throw new IllegalArgumentException("Non è possibile programmare una visita nel passato");
        }
    }

    // --- Mapping methods ---
    private VisitaDTO toDTO(Visita entity) {
        VisitaDTO dto = new VisitaDTO();
        dto.setId(entity.getId());
        if (entity.getPaziente() != null) {
            dto.setPazienteId(entity.getPaziente().getId());
            // Popola informazioni base del paziente nel DTO paziente se disponibile nel progetto
            // In questo codice il tipo è PazienteDTO, quindi lo popoliamo parzialmente
            Paziente paziente = entity.getPaziente();
            com.nutrihouse.patient_service.dto.PazienteDTO pDto = new com.nutrihouse.patient_service.dto.PazienteDTO();
            pDto.setId(paziente.getId());
            pDto.setNome(paziente.getNome());
            pDto.setCognome(paziente.getCognome());
            pDto.setEmail(paziente.getEmail());
            dto.setPaziente(pDto);
        }
        dto.setDataVisita(entity.getDataVisita());
        dto.setStato(entity.getStato() != null ? entity.getStato().name() : null);
        dto.setPeso(entity.getPeso());
        dto.setAltezza(entity.getAltezza());
        dto.setNote(entity.getNote());
        dto.setObiettivi(entity.getObiettivi());
        dto.setDataCreazione(entity.getDataCreazione());
        dto.setDataModifica(entity.getDataModifica());
        // Campi legacy presenti nell'entità potrebbero non esistere nel DTO attuale (data, anamnesi è presente)
        dto.setAnamnesi(entity.getAnamnesi());
        return dto;
    }

    private Visita toEntity(VisitaDTO dto, Paziente paziente) {
        Visita.StatoVisita stato = Visita.StatoVisita.PROGRAMMATA;
        if (dto.getStato() != null) {
            try {
                stato = Visita.StatoVisita.valueOf(dto.getStato().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Stato non valido '{}', usando PROGRAMMATA come default", dto.getStato());
            }
        }

        return Visita.builder()
                .id(dto.getId())
                .paziente(paziente)
                .dataVisita(dto.getDataVisita())
                .stato(stato)
                .peso(dto.getPeso())
                .altezza(dto.getAltezza())
                .note(dto.getNote())
                .obiettivi(dto.getObiettivi())
                // Campi legacy nel DTO: solo anamnesi è presente
                .anamnesi(dto.getAnamnesi())
                .build();
    }

    private void updateEntityFromDTO(Visita entity, VisitaDTO dto) {
        entity.setDataVisita(dto.getDataVisita());
        
        if (dto.getStato() != null) {
            try {
                entity.setStato(Visita.StatoVisita.valueOf(dto.getStato().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Stato non valido '{}', mantenendo stato attuale", dto.getStato());
            }
        }
        
        entity.setPeso(dto.getPeso());
        entity.setAltezza(dto.getAltezza());
        entity.setNote(dto.getNote());
        entity.setObiettivi(dto.getObiettivi());
        
        // Campi legacy
        if (dto.getAnamnesi() != null) {
            entity.setAnamnesi(dto.getAnamnesi());
        }
    }
}