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
    
    // Verifica esistenza email
    boolean existsByEmail(String email);
    
    // Ricerca per email
    Optional<Paziente> findByEmail(String email);
    
    // Ricerca per nome e cognome
    List<Paziente> findByNomeContainingIgnoreCaseOrCognomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String nome, String cognome, String email);
    
    // Ricerca per sesso
    List<Paziente> findBySesso(String sesso);
    
    // Pazienti nati in un range di date
    List<Paziente> findByDataNascitaBetween(LocalDate startDate, LocalDate endDate);
    
    // Pazienti creati di recente
    @Query("SELECT p FROM Paziente p WHERE p.dataCreazione >= :date ORDER BY p.dataCreazione DESC")
    List<Paziente> findRecentPazienti(@Param("date") java.time.LocalDateTime date);
    
    // Conta pazienti per sesso
    @Query("SELECT p.sesso, COUNT(p) FROM Paziente p GROUP BY p.sesso")
    List<Object[]> countBySesso();
    
    // Ricerca full-text
    @Query("SELECT p FROM Paziente p WHERE " +
           "LOWER(CONCAT(p.nome, ' ', p.cognome)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "p.telefono LIKE CONCAT('%', :searchTerm, '%')")
    List<Paziente> searchPazienti(@Param("searchTerm") String searchTerm);
    
    // Pazienti con obiettivi specifici
    List<Paziente> findByObiettivoContainingIgnoreCase(String obiettivo);
}