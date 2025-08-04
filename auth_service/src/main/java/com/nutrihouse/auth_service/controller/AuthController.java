package com.nutrihouse.auth_service.controller;

import com.nutrihouse.auth_service.dto.RegisterRequest;
import com.nutrihouse.auth_service.dto.LoginRequest;
import com.nutrihouse.auth_service.dto.AuthResponse;
import com.nutrihouse.auth_service.model.User;
import com.nutrihouse.auth_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller per la gestione delle operazioni di autenticazione.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Endpoint per la registrazione di un nuovo utente.
     *
     * -param request oggetto contenente email, password e nome completo.
     * -return ResponseEntity con lo user appena creato o errore.
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User newUser = userService.registerUser(request);
        return ResponseEntity.ok(newUser);
    }

    /**
     * Endpoint per il login.
     *
     * -param request oggetto contenente email e password.
     * -return ResponseEntity con il token JWT se le credenziali sono corrette.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = userService.authenticateUser(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}