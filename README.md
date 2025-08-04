# NutriHouse – Gestionale per Nutrizionisti

**NutriHouse** è una piattaforma fullstack per la gestione avanzata di pazienti, visite, diete e alimenti, progettata in architettura a microservizi.  
Il progetto è pensato per studi nutrizionistici e professionisti del settore, con sicurezza JWT, CRUD completo, e backend scalabile pronto per il cloud.

---

## 🚀 Architettura & Tecnologie

- **Java 21, Spring Boot** (microservizi, REST API)
- **Spring Security + JWT** (autenticazione, autorizzazione)
- **JPA/Hibernate, MySQL** (persistenza dati)
- **React (Vite), Material UI** (frontend moderno)
- **Swagger/OpenAPI** (documentazione interattiva)
- **Docker ready** (per futuro deploy containerizzato)
- **Eureka** (service discovery)
- **Maven** (gestione dipendenze)

---

## 📂 Struttura dei microservizi
- ** auth-service #microservizio per autenticazione e jwt
- ** patient-service #Gestione pazienti e visite
- (diete , gateway prossimamente...)

---

## ✨ Funzionalità principali

- **Autenticazione/Autorizzazione JWT** (`ROLE_ADMIN`, `ROLE_NUTRITIONIST`)
- **CRUD completo** su pazienti, visite, diete, alimenti
- **Relazioni tra entità**: ogni paziente ha più visite, piani alimentari, allergie, ecc.
- **Swagger UI** integrata per test API e documentazione interattiva
- **Ruoli personalizzabili** per massima flessibilità

---

## 🛠️ Come eseguire il progetto

1. **Clona il repository**
    ```bash
    git clone https://github.com/CSINCE90/NHmicroservices.git
    ```
2. **Configura il database**
    - Crea i database MySQL necessari
    - Copia/Adatta i file `application.yml` o `application.properties` per ogni microservizio

3. **Avvia i microservizi**
    ```bash
    cd auth_service
    mvn spring-boot:run
    # In un'altra shell
    cd ../patient_service
    mvn spring-boot:run
    # ... e così via per ogni microservizio
    ```

4. **Accedi alle Swagger UI**
    - [Auth Service Swagger UI](http://localhost:8081/swagger-ui.html)
    - [Patient Service Swagger UI](http://localhost:8082/swagger-ui.html)

5. **Testa le API**
    - Effettua login su `/api/auth/login`
    - Usa il JWT per autenticarti sulle altre API

---

## 👨‍💻 Autore

**Francesco Chifari**  
Junior Software Developer 
📍 Palermo, IT  
[LinkedIn](https://www.linkedin.com/in/francesco-chifari-386550112/) • [GitHub](https://github.com/CSINCE90)

---

## 📜 Note

- I file `application.properties`/`application.yml` NON sono versionati per sicurezza.  
  Usa gli `example` o chiedi info per setup locale.
- Il progetto è in sviluppo continuo: contribuzioni e segnalazioni sono benvenute!

---

> _“No excuses, solo lavoro, formazione e determinazione. L’impossibile è solo una meta che vuole farsi raggiungere.”_

---
