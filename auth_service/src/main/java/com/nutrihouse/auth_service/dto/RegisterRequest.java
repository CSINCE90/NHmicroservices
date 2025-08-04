package com.nutrihouse.auth_service.dto;

import lombok.Data;

/**
 * DTO per la richiesta di registrazione di un nuovo utente.
 */
@Data
public class RegisterRequest {

    /**
     * Email dell'utente che si registra.
     */
    private String email;

    /**
     * Password scelta dall'utente.
     */
    private String password;

    /**
     * Nome completo dell'utente.
     */
    private String fullName;
}
