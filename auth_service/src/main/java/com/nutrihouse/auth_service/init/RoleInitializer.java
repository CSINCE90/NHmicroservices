package com.nutrihouse.auth_service.init;

import com.nutrihouse.auth_service.model.Role;
import com.nutrihouse.auth_service.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(1) // Esegui prima dell'AdminInitializer
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        List<String> roleNames = Arrays.asList("ROLE_ADMIN", "ROLE_NUTRITIONIST");
        
        for (String roleName : roleNames) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
                System.out.println("✅ Ruolo " + roleName + " creato con successo.");
            } else {
                System.out.println("ℹ️ Ruolo " + roleName + " già presente.");
            }
        }
    }
}