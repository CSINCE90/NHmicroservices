# NutriHouse – Deploy con Docker

## 📌 Requisiti
- **Docker Desktop** installato
- Cartella completa del progetto **NHmicroservices**

---

## 🚀 Avvio dell’applicazione
1. Aprire un terminale nella cartella principale del progetto:
   ```bash
      cd NHmicroservices

2. Eseguire il comando:
docker-compose -f docker-compose.finale.yml up -d

3.	Attendere l’avvio completo di tutti i container
(la prima volta richiede più tempo perché vengono scaricate le immagini).

⸻

⚙️ Cosa succede
	•	Viene avviato MySQL:
	•	Porta esterna: 3307
	•	Password root: Francesco90
	•	Vengono creati automaticamente i database:
	•	authdb
	•	patientdb
	•	fooddb
	•	dietdb
	•	Partono i microservizi:
	•	auth-service
	•	patient-service
	•	food-service
	•	diet-service
	•	Parte il Eureka Server (service discovery).
	•	Parte il Frontend React.

⸻

🌐 Accesso all’applicazione

Aprire il browser e collegarsi a:
👉 http://localhost:80
