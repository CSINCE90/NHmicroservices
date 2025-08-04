package com.nutrihouse.auth_service.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entità che rappresenta un ruolo associabile agli utenti.
 */
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    /**
     * Identificativo univoco del ruolo.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome del ruolo (es. ROLE_USER, ROLE_ADMIN).
     */
    @Column(unique = true, nullable = false)
    private String name;
}
