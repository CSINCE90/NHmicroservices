package com.nutrihouse.patient_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nutrihouse.patient_service.model.Paziente;

public interface PazienteRepository extends JpaRepository<Paziente, Long> {
    

    
}
