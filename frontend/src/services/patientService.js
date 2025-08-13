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

  getVisit: async (id) => {
    const response = await api.get(`${PATIENT_API_URL}/visite/${id}`);
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

  /**
   * Ritorna tutte le visite associate a uno specifico paziente.
   * Normalizza sempre la risposta in un array, anche se l'API restituisce
   * un singolo oggetto quando esiste una sola visita.
   */
  getVisiteByPaziente: async (pazienteId) => {
    const response = await api.get(`${PATIENT_API_URL}/visite/paziente/${pazienteId}`);
    const data = response.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  },

  /**
   * Versione REST-style: /pazienti/{id}/visite
   * Restituisce tutte le visite per uno specifico paziente.
   * Il risultato è sempre un array.
   */
  getPatientVisits: async (pazienteId) => {
    const response = await api.get(`${PATIENT_API_URL}/visite/paziente/${pazienteId}`);
    const data = response.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  },

  /**
   * Variante query-param: /visite?pazienteId={id}
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
    // Helpers
    const toIsoDateTime = (dateVal, timeVal) => {
      if (dateVal && timeVal) {
        return dayjs(`${dateVal} ${timeVal}`).format('YYYY-MM-DDTHH:mm:ss');
      }
      if (dateVal) {
        return dayjs(dateVal).format('YYYY-MM-DDTHH:mm:ss');
      }
      return null;
    };

    const mapStatus = (s) => {
      if (!s) return null;
      const v = s.toString().trim().toLowerCase();
      if (v.startsWith('prog')) return 'PROGRAMMATA';
      if (v.startsWith('comp')) return 'COMPLETATA';
      if (v.startsWith('ann') || v.startsWith('canc')) return 'ANNULLATA';
      // Se già maiuscolo corretto, lo lasciamo passare
      if (['PROGRAMMATA','COMPLETATA','ANNULLATA'].includes(s)) return s;
      return s.toString().toUpperCase();
    };

    const toNumberOrNull = (x) => {
      if (x === undefined || x === null || x === '') return null;
      const n = Number(x);
      return Number.isFinite(n) ? n : null;
    };

    const payload = {
      // Id paziente può provenire da select oggetto o valore numerico
      pazienteId: visitData?.pazienteId ?? visitData?.patientId ?? visitData?.paziente?.id ?? null,

      // LocalDateTime ISO per Spring
      dataVisita: visitData?.dataVisita
        ? dayjs(visitData.dataVisita).format('YYYY-MM-DDTHH:mm:ss')
        : toIsoDateTime(visitData?.data, visitData?.ora),

      // Enum stato in italiano richiesto dal DTO
      stato: mapStatus(visitData?.stato ?? visitData?.status),

      // Numerici
      peso: toNumberOrNull(visitData?.peso ?? visitData?.pesoKg),
      altezza: toNumberOrNull(visitData?.altezza ?? visitData?.altezzaCm),

      // Opzionali
      obiettivi: visitData?.obiettivi ?? visitData?.objective ?? null,
      note: visitData?.note ?? null,
    };

    const response = await api.post(`${PATIENT_API_URL}/visite`, payload);
    return response.data;
  },

  updateVisit: async (id, visitData) => {
    // Helpers (replicati per coerenza con createVisit)
    const toIsoDateTime = (dateVal, timeVal) => {
      if (dateVal && timeVal) {
        return dayjs(`${dateVal} ${timeVal}`).format('YYYY-MM-DDTHH:mm:ss');
      }
      if (dateVal) {
        return dayjs(dateVal).format('YYYY-MM-DDTHH:mm:ss');
      }
      return null;
    };

    const mapStatus = (s) => {
      if (!s) return null;
      const v = s.toString().trim().toLowerCase();
      if (v.startsWith('prog')) return 'PROGRAMMATA';
      if (v.startsWith('comp')) return 'COMPLETATA';
      if (v.startsWith('ann') || v.startsWith('canc')) return 'ANNULLATA';
      if (['PROGRAMMATA','COMPLETATA','ANNULLATA'].includes(s)) return s;
      return s.toString().toUpperCase();
    };

    const toNumberOrNull = (x) => {
      if (x === undefined || x === null || x === '') return null;
      const n = Number(x);
      return Number.isFinite(n) ? n : null;
    };

    const payload = {
      pazienteId: visitData?.pazienteId ?? visitData?.patientId ?? visitData?.paziente?.id ?? null,
      dataVisita: visitData?.dataVisita
        ? dayjs(visitData.dataVisita).format('YYYY-MM-DDTHH:mm:ss')
        : toIsoDateTime(visitData?.data, visitData?.ora),
      stato: mapStatus(visitData?.stato ?? visitData?.status),
      peso: toNumberOrNull(visitData?.peso ?? visitData?.pesoKg),
      altezza: toNumberOrNull(visitData?.altezza ?? visitData?.altezzaCm),
      obiettivi: visitData?.obiettivi ?? visitData?.objective ?? null,
      note: visitData?.note ?? null,
    };

    const response = await api.put(`${PATIENT_API_URL}/visite/${id}`, payload);
    return response.data;
  },
};