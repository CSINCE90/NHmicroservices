package com.nutrihouse.patient_service.model;


import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Table;




@Entity
@Table(name = "paziente")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Paziente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fullName", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "codiceFiscale", nullable = false, length = 16, unique = true, updatable = false)
    private String codiceFiscale;

    @Column(name = "dataNascita", nullable = false)
    private String dataNascita;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "indirizzo", nullable = false)
    private String indirizzo;

    //fammi una relazione OneToMany con l'entita visita

    @OneToMany(mappedBy = "paziente", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Visita> visite;



    
}
