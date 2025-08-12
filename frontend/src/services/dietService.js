// frontend/src/services/dietService.js
import api from './api';
import { DIET_API_URL } from '../utils/constants';

// Se DIET_API_URL è già "/api/diet-plans" NON ri-aggiungiamo "diet-plans"
// Esempi validi: 
//  - DIET_API_URL = "/api/diet-plans"  -> BASE = "/api/diet-plans"
//  - DIET_API_URL = "/api/diet-plans/" -> BASE = "/api/diet-plans"
const BASE = `${DIET_API_URL}`.replace(/\/$/, '');

export const dietService = {
  // ==================== CRUD Operations ====================
  // Crea nuovo elemento del piano
  createElement: async (dietPlanData) => {
    const { data } = await api.post(`${BASE}`, dietPlanData);
    return data;
  },

  // Recupera elemento per ID
  getElementById: async (id) => {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  // Aggiorna elemento
  updateElement: async (id, updateData) => {
    const { data } = await api.put(`${BASE}/${id}`, updateData);
    return data;
  },

  // Elimina elemento
  deleteElement: async (id) => {
    await api.delete(`${BASE}/${id}`);
    return true;
  },

  // ==================== Plan Operations ====================
  // Recupera piano completo
  getPlanByPatientAndTitle: async (patientId, title) => {
    const safeTitle = encodeURIComponent(title);
    const { data } = await api.get(`${BASE}/patient/${patientId}/plan/${safeTitle}`);
    return data;
  },

  // Riepilogo piano con statistiche
  getPlanSummary: async (patientId, title) => {
    const safeTitle = encodeURIComponent(title);
    const { data } = await api.get(`${BASE}/patient/${patientId}/plan/${safeTitle}/summary`);
    return data;
  },

  // Lista titoli piani per paziente
  getPlanTitles: async (patientId) => {
    const { data } = await api.get(`${BASE}/patient/${patientId}/titles`);
    return data;
  },

  // Elimina piano completo
  deletePlan: async (patientId, title) => {
    const safeTitle = encodeURIComponent(title);
    await api.delete(`${BASE}/patient/${patientId}/plan/${safeTitle}`);
    return true;
  },

  // Duplica piano
  duplicatePlan: async (patientId, sourceTitle, newTitle) => {
    const safeSource = encodeURIComponent(sourceTitle);
    const { data } = await api.post(
      `${BASE}/patient/${patientId}/plan/${safeSource}/duplicate`,
      null,
      { params: { newTitle } }
    );
    return data;
  },

  // ==================== Query Operations ====================
  // Recupera per giorno
  getByDay: async (patientId, title, dayOfWeek) => {
    const safeTitle = encodeURIComponent(title);
    const { data } = await api.get(`${BASE}/patient/${patientId}/plan/${safeTitle}/day/${dayOfWeek}`);
    return data;
  },

  // Recupera per tipo pasto
  getByMealType: async (patientId, title, mealType) => {
    const safeTitle = encodeURIComponent(title);
    const { data } = await api.get(`${BASE}/patient/${patientId}/plan/${safeTitle}/meal-type/${mealType}`);
    return data;
  },

  // ==================== Batch Operations ====================
  // Crea elementi in batch
  createBatch: async (elements) => {
    const { data } = await api.post(`${BASE}/batch`, elements);
    return data;
  },

  // Elimina elementi in batch
  deleteBatch: async (ids) => {
    await api.delete(`${BASE}/batch`, { data: ids });
    return true;
  },

  // ==================== Helper Functions ====================
  // Formatta i dati del piano per la visualizzazione
  formatPlanData: (planItems) => {
    const grouped = {
      byDay: {},
      byMealType: {},
      totalNutrition: { calories: 0, proteins: 0, carbs: 0, fats: 0 },
    };

    planItems.forEach((item) => {
      if (!grouped.byDay[item.dayOfWeek]) grouped.byDay[item.dayOfWeek] = [];
      grouped.byDay[item.dayOfWeek].push(item);

      if (!grouped.byMealType[item.mealType]) grouped.byMealType[item.mealType] = [];
      grouped.byMealType[item.mealType].push(item);

      grouped.totalNutrition.calories += item.calories || 0;
      grouped.totalNutrition.proteins += item.proteins || 0;
      grouped.totalNutrition.carbs += item.carbs || 0;
      grouped.totalNutrition.fats += item.fats || 0;
    });

    return grouped;
  },

  // Valida i dati del piano prima dell'invio
  validatePlanData: (data) => {
    const errors = {};
    if (!data.patientId) errors.patientId = 'Paziente richiesto';
    if (!data.title || !data.title.trim()) errors.title = 'Titolo richiesto';
    if (!data.dayOfWeek || data.dayOfWeek < 1 || data.dayOfWeek > 7) errors.dayOfWeek = 'Giorno non valido (1-7)';
    if (!data.mealType) errors.mealType = 'Tipo pasto richiesto';
    if (!data.foodId) errors.foodId = 'Alimento richiesto';
    if (!data.quantity || data.quantity <= 0) errors.quantity = 'Quantità deve essere positiva';
    if (!data.unit) errors.unit = 'Unità di misura richiesta';
    return errors;
  },

  // Costanti per i tipi di pasto (chiavi = valori che il backend si aspetta)
  MEAL_TYPES: {
    COLAZIONE: 'Colazione',
    SPUNTINO_MATTINA: 'Spuntino Mattina',
    PRANZO: 'Pranzo',
    MERENDA: 'Merenda',
    CENA: 'Cena',
    SPUNTINO_SERA: 'Spuntino Sera',
  },

  // Costanti per i giorni della settimana
  DAYS_OF_WEEK: { 1: 'Lunedì', 2: 'Martedì', 3: 'Mercoledì', 4: 'Giovedì', 5: 'Venerdì', 6: 'Sabato', 7: 'Domenica' },

  // Helpers nomi
  getDayName: (dayIndex) => dietService.DAYS_OF_WEEK[dayIndex] || `Giorno ${dayIndex}`,
  getMealTypeName: (mealType) => dietService.MEAL_TYPES[mealType] || mealType,
};