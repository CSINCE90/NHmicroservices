import api from './api';
import { PATIENT_API_URL } from '../utils/constants';
import dayjs from 'dayjs';

export const patientService = {
  // Pazienti
  getAllPatients: async () => {
    const response = await api.get(`${PATIENT_API_URL}/pazienti`);
    return response.data;
  },

  getPatient: async (id) => {
    const response = await api.get(`${PATIENT_API_URL}/pazienti/${id}`);
    return response.data;
  },

  createPatient: async (patientData) => {
    // Normalizzazione dati per il DTO backend
    const payload = {
      ...patientData,
      // LocalDate in ISO (YYYY-MM-DD) per Spring
      dataNascita: patientData?.dataNascita
        ? dayjs(patientData.dataNascita).format('YYYY-MM-DD')
        : null,
      // Converte valori UI (Maschio/Femmina, M/F, m/f) in 'M'/'F'
      sesso: typeof patientData?.sesso === 'string'
        ? (patientData.sesso.trim().toLowerCase().startsWith('m') ? 'M' : 'F')
        : patientData?.sesso,
    };

    const response = await api.post(`${PATIENT_API_URL}/pazienti/create`, payload);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await api.put(`${PATIENT_API_URL}/pazienti/${id}`, patientData);
    return response.data;
  },

  deletePatient: async (id) => {
    await api.delete(`${PATIENT_API_URL}/pazienti/${id}`);
  },

  // Visite
  /*getAllVisits: async () => {
    const response = await api.get(`${PATIENT_API_URL}/visite`);
    return response.data;
  },*/

  /**
   * Ritorna tutte le visite associate a uno specifico paziente.
   * Normalizza sempre la risposta in un array, anche se l'API restituisce
   * un singolo oggetto quando esiste una sola visita.
   */
  getVisiteByPaziente: async (pazienteId) => {
    const response = await api.get(`${PATIENT_API_URL}/visite/${pazienteId}`);
    const data = response.data;
    // Se l'API restituisce un solo oggetto lo incapsuliamo in un array.
    return Array.isArray(data) ? data : (data ? [data] : []);
  },

  /**
   * Versione REST‑style: /pazienti/{id}/visite
   * Restituisce tutte le visite per uno specifico paziente.
   * Il risultato è sempre un array.
   */
  getPatientVisits: async (pazienteId) => {
    const response = await api.get(`${PATIENT_API_URL}/pazienti/${pazienteId}/visite`);
    const data = response.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  },

  /**
   * Variante query‑param: /visite?pazienteId={id}
   * Restituisce tutte le visite per uno specifico paziente usando il request param.
   * Il risultato è sempre un array.
   */
  getVisiteByPazienteParam: async (pazienteId) => {
    const response = await api.get(`${PATIENT_API_URL}/visite`, {
      params: { pazienteId },
    });
    const data = response.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  },

  createVisit: async (visitData) => {
    const response = await api.post(`${PATIENT_API_URL}/visite`, visitData);
    return response.data;
  },
};