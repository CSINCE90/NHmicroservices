package com.nutrihouse.auth_service.repository;


import com.nutrihouse.auth_service.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository per l'entità Role.
 */
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Cerca un ruolo per nome.
     *
     * (@)param name nome del ruolo (es. ROLE_ADMIN, ROLE_NUTRITIONIST)
     *  return un Optional contenente il ruolo trovato, se esiste.
     */
    Optional<Role> findByName(String name);
}
