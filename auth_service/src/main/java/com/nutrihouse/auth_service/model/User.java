package com.nutrihouse.auth_service.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.stream.Collectors;

import jakarta.persistence.*;
import lombok.*;


import java.util.HashSet;
import java.util.Set;

/**
 * Entità che rappresenta un utente del sistema.
 */
@Entity
@Table(name = "users") // tabella 'users' nel database
@Data                 // genera getter, setter, toString, equals, hashCode
@NoArgsConstructor    // costruttore vuoto (necessario per JPA)
@AllArgsConstructor   // costruttore con tutti gli argomenti
@Builder              // pattern builder utile per creare oggetti User in modo fluente
public class User implements UserDetails {

    /**
     * Identificativo unico dell'utente (generato automaticamente dal DB).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Email utilizzata per il login (univoca).
     */
    @Column(unique = true, nullable = false)
    private String email;

    /**
     * Password criptata dell'utente.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Nome completo dell'utente.
     */
    @Column(nullable = false)
    private String fullName;

    /**
     * Ruoli assegnati all'utente.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}