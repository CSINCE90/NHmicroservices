package com.nutrihouse.auth_service.init;

import com.nutrihouse.auth_service.model.Role;
import com.nutrihouse.auth_service.model.User;
import com.nutrihouse.auth_service.repository.RoleRepository;
import com.nutrihouse.auth_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.fullName}")
    private String adminFullName;

    public AdminInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ROLE_ADMIN");
                        return roleRepository.save(role);
                    });

            User admin = new User();
            admin.setFullName(adminFullName);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRoles(Collections.singleton(adminRole));

            userRepository.save(admin);

            System.out.println("✅ Admin utente creato con successo.");
        } else {
            System.out.println("ℹ️ Admin utente già presente. Nessuna azione eseguita.");
        }
    }
}