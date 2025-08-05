import api from './api';
import { PATIENT_API_URL } from '../utils/constants';

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
    const response = await api.post(`${PATIENT_API_URL}/pazienti/create`, patientData);
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
  getAllVisits: async () => {
    const response = await api.get(`${PATIENT_API_URL}/visite`);
    return response.data;
  },

  createVisit: async (visitData) => {
    const response = await api.post(`${PATIENT_API_URL}/visite`, visitData);
    return response.data;
  },
};