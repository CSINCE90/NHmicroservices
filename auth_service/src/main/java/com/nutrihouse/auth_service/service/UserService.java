package com.nutrihouse.auth_service.service;

import com.nutrihouse.auth_service.dto.LoginRequest;
import com.nutrihouse.auth_service.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import com.nutrihouse.auth_service.dto.RegisterRequest;
import com.nutrihouse.auth_service.model.Role;
import com.nutrihouse.auth_service.model.User;
import com.nutrihouse.auth_service.repository.RoleRepository;
import com.nutrihouse.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Servizio per gestire la logica degli utenti (registrazione e verifica).
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Registra un nuovo utente con il ruolo di nutrizionista.
     *
     * -param request dati di registrazione.
     * -return l'utente appena creato.
     * -throws IllegalStateException se l'utente esiste già o il ruolo non è stato trovato.
     */
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email già in uso: " + request.getEmail());
        }

        Role nutritionistRole = roleRepository.findByName("ROLE_NUTRITIONIST")
                .orElseThrow(() -> new IllegalStateException("Ruolo nutrizionista non trovato!"));

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .roles(Collections.singleton(nutritionistRole))
                .build();

        return userRepository.save(user);
    }

    /**
     * Trova un utente tramite email.
     *
     * -param email email dell'utente.
     * -return l'utente trovato o null se non esiste.
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public String authenticateUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Email non trovata"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Password errata");
        }

        return jwtService.generateToken(user.getEmail());
    }



//🛠️ Spiegazione della classe:
	/*•	Usa @RequiredArgsConstructor di Lombok per creare un costruttore con tutte le dipendenze necessarie (repository, encoder).
	•	Metodo registerUser:
	•	Verifica se l’utente già esiste.
	•	Recupera il ruolo “ROLE_NUTRITIONIST”.
	•	Crea l’utente con la password criptata e il ruolo appropriato.
	•	Metodo findByEmail utile per il login futuro.*/



}
