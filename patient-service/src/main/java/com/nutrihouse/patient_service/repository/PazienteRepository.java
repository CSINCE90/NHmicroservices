package com.nutrihouse.patient_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nutrihouse.patient_service.model.Paziente;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PazienteRepository extends JpaRepository<Paziente, Long> {
    
    // ========== METODI FILTRATI PER UTENTE CREATORE ==========
    
    // Trova tutti i pazienti creati da un utente specifico
    List<Paziente> findByCreatedByOrderByDataCreazioneDesc(String createdBy);
    
    // Trova paziente per ID solo se creato dall'utente
    Optional<Paziente> findByIdAndCreatedBy(Long id, String createdBy);
    
    // Ricerca tra i pazienti dell'utente
    @Query("SELECT p FROM Paziente p WHERE p.createdBy = :createdBy AND " +
           "(LOWER(p.nome) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.cognome) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "p.telefono LIKE CONCAT('%', :searchTerm, '%'))")
    List<Paziente> searchPazientiByUser(@Param("createdBy") String createdBy, 
                                       @Param("searchTerm") String searchTerm);
    
    // Pazienti per sesso dell'utente
    List<Paziente> findByCreatedByAndSesso(String createdBy, String sesso);
    
    // Pazienti nati in un range di date dell'utente
    List<Paziente> findByCreatedByAndDataNascitaBetween(String createdBy, LocalDate startDate, LocalDate endDate);
    
    // Pazienti creati di recente dall'utente
    @Query("SELECT p FROM Paziente p WHERE p.createdBy = :createdBy " +
           "AND p.dataCreazione >= :date ORDER BY p.dataCreazione DESC")
    List<Paziente> findRecentPazientiByUser(@Param("createdBy") String createdBy,
                                           @Param("date") java.time.LocalDateTime date);
    
    // Conta pazienti per sesso dell'utente
    @Query("SELECT p.sesso, COUNT(p) FROM Paziente p WHERE p.createdBy = :createdBy GROUP BY p.sesso")
    List<Object[]> countBySessoByUser(@Param("createdBy") String createdBy);
    
    // Pazienti con obiettivi specifici dell'utente
    List<Paziente> findByCreatedByAndObiettivoContainingIgnoreCase(String createdBy, String obiettivo);
    
    // ========== METODI GLOBALI (mantenuti per compatibilità) ==========
    
    // Verifica esistenza email
    boolean existsByEmail(String email);
    
    // Ricerca per email
    Optional<Paziente> findByEmail(String email);
    
    // Ricerca per nome e cognome (globale)
    List<Paziente> findByNomeContainingIgnoreCaseOrCognomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String nome, String cognome, String email);
    
    // Ricerca per sesso (globale)
    List<Paziente> findBySesso(String sesso);
    
    // Pazienti nati in un range di date (globale)
    List<Paziente> findByDataNascitaBetween(LocalDate startDate, LocalDate endDate);
    
    // Pazienti creati di recente (globale)
    @Query("SELECT p FROM Paziente p WHERE p.dataCreazione >= :date ORDER BY p.dataCreazione DESC")
    List<Paziente> findRecentPazienti(@Param("date") java.time.LocalDateTime date);
    
    // Conta pazienti per sesso (globale)
    @Query("SELECT p.sesso, COUNT(p) FROM Paziente p GROUP BY p.sesso")
    List<Object[]> countBySesso();
    
    // Ricerca full-text (globale)
    @Query("SELECT p FROM Paziente p WHERE " +
           "LOWER(CONCAT(p.nome, ' ', p.cognome)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "p.telefono LIKE CONCAT('%', :searchTerm, '%')")
    List<Paziente> searchPazienti(@Param("searchTerm") String searchTerm);
    
    // Pazienti con obiettivi specifici (globale)
    List<Paziente> findByObiettivoContainingIgnoreCase(String obiettivo);
}