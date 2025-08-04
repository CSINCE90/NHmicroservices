package com.nutrihouse.auth_service.repository;


import com.nutrihouse.auth_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository per l'entità User.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Cerca un utente per email.
     *
     * (@ param email) l'email dell'utente da cercare.
     * (@ return) un Optional contenente l'utente trovato, se esiste.
     */
    Optional<User> findByEmail(String email);

    /**
     * Controlla se esiste già un utente con una data email.
     *
     * (@ param email) l'email da verificare.
     * (@ return) true se esiste, false altrimenti.
     */
    boolean existsByEmail(String email);
}
