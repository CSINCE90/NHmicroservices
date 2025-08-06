package com.nutrihouse.patient_service.repository;

import com.nutrihouse.patient_service.model.Visita;
import com.nutrihouse.patient_service.model.Paziente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitaRepository extends JpaRepository<Visita, Long> {

    // Trova visite per paziente ordinate per data decrescente (più recenti prima)
    List<Visita> findByPazienteIdOrderByDataVisitaDesc(Long pazienteId);
    
    // Trova visite per stato ordinate per data
    List<Visita> findByStatoOrderByDataVisitaAsc(Visita.StatoVisita stato);
    
    // Trova visite in un range di date con stato specifico
    List<Visita> findByDataVisitaBetweenAndStatoOrderByDataVisitaAsc(
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        Visita.StatoVisita stato
    );
    
    // Trova visite in un range di date
    List<Visita> findByDataVisitaBetweenOrderByDataVisitaAsc(
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
    
    // Verifica se esiste una visita per paziente a una data specifica
    boolean existsByPazienteAndDataVisita(Paziente paziente, LocalDateTime dataVisita);
    
    // Query con join per evitare N+1 problem
    @Query("SELECT v FROM Visita v JOIN FETCH v.paziente ORDER BY v.dataVisita DESC")
    List<Visita> findAllWithPaziente();
    
    // Trova visite di oggi
    @Query("SELECT v FROM Visita v WHERE DATE(v.dataVisita) = CURRENT_DATE ORDER BY v.dataVisita ASC")
    List<Visita> findVisiteOggi();
    
    // Trova visite della settimana corrente
    @Query("SELECT v FROM Visita v WHERE YEARWEEK(v.dataVisita) = YEARWEEK(CURRENT_DATE) ORDER BY v.dataVisita ASC")
    List<Visita> findVisiteSettimanaCorrente();
    
    // Conta visite per stato
    @Query("SELECT v.stato, COUNT(v) FROM Visita v GROUP BY v.stato")
    List<Object[]> countByStato();
    
    // Trova visite recenti (ultimo mese) per paziente
    @Query("SELECT v FROM Visita v WHERE v.paziente.id = :pazienteId AND v.dataVisita >= :dataInizio ORDER BY v.dataVisita DESC")
    List<Visita> findRecentVisiteByPaziente(
        @Param("pazienteId") Long pazienteId, 
        @Param("dataInizio") LocalDateTime dataInizio
    );
    
    // Trova prossima visita per paziente
    @Query("SELECT v FROM Visita v WHERE v.paziente.id = :pazienteId AND v.dataVisita > CURRENT_TIMESTAMP AND v.stato = 'PROGRAMMATA' ORDER BY v.dataVisita ASC LIMIT 1")
    Optional<Visita> findProssimaVisitaByPaziente(@Param("pazienteId") Long pazienteId);
    
    // Trova visite in conflitto (stesso paziente, orario sovrapposto)
    @Query("SELECT v FROM Visita v WHERE v.paziente.id = :pazienteId AND v.id != :visitaId AND " +
           "v.dataVisita BETWEEN :inizioFinestra AND :fineFinestra AND v.stato != 'ANNULLATA'")
    List<Visita> findVisiteInConflitto(
        @Param("pazienteId") Long pazienteId,
        @Param("visitaId") Long visitaId,
        @Param("inizioFinestra") LocalDateTime inizioFinestra,
        @Param("fineFinestra") LocalDateTime fineFinestra
    );
    
    // Statistiche visite per mese
    @Query("SELECT MONTH(v.dataVisita), YEAR(v.dataVisita), COUNT(v) FROM Visita v " +
           "WHERE v.dataVisita >= :dataInizio GROUP BY YEAR(v.dataVisita), MONTH(v.dataVisita) " +
           "ORDER BY YEAR(v.dataVisita), MONTH(v.dataVisita)")
    List<Object[]> getStatisticheVisitePerMese(@Param("dataInizio") LocalDateTime dataInizio);
}