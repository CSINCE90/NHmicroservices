// frontend/src/services/dietService.js
import api from './api';
import { DIET_API_URL } from '../utils/constants';

export const dietService = {
  // ==================== CRUD Operations ====================
  
  // Crea nuovo elemento del piano
  createElement: async (dietPlanData) => {
    const response = await api.post(`${DIET_API_URL}/diet-plans`, dietPlanData);
    return response.data;
  },

  // Recupera elemento per ID
  getElementById: async (id) => {
    const response = await api.get(`${DIET_API_URL}/diet-plans/${id}`);
    return response.data;
  },

  // Aggiorna elemento
  updateElement: async (id, updateData) => {
    const response = await api.put(`${DIET_API_URL}/diet-plans/${id}`, updateData);
    return response.data;
  },

  // Elimina elemento
  deleteElement: async (id) => {
    await api.delete(`${DIET_API_URL}/diet-plans/${id}`);
    return true;
  },

  // ==================== Plan Operations ====================
  
  // Recupera piano completo
  getPlanByPatientAndTitle: async (patientId, title) => {
    const response = await api.get(`${DIET_API_URL}/diet-plans/patient/${patientId}/plan/${title}`);
    return response.data;
  },

  // Riepilogo piano con statistiche
  getPlanSummary: async (patientId, title) => {
    const response = await api.get(`${DIET_API_URL}/diet-plans/patient/${patientId}/plan/${title}/summary`);
    return response.data;
  },

  // Lista titoli piani per paziente
  getPlanTitles: async (patientId) => {
    const response = await api.get(`${DIET_API_URL}/diet-plans/patient/${patientId}/titles`);
    return response.data;
  },

  // Elimina piano completo
  deletePlan: async (patientId, title) => {
    await api.delete(`${DIET_API_URL}/diet-plans/patient/${patientId}/plan/${title}`);
    return true;
  },

  // Duplica piano
  duplicatePlan: async (patientId, sourceTitle, newTitle) => {
    const response = await api.post(
      `${DIET_API_URL}/diet-plans/patient/${patientId}/plan/${sourceTitle}/duplicate`,
      null,
      { params: { newTitle } }
    );
    return response.data;
  },

  // ==================== Query Operations ====================
  
  // Recupera per giorno
  getByDay: async (patientId, title, dayOfWeek) => {
    const response = await api.get(
      `${DIET_API_URL}/diet-plans/patient/${patientId}/plan/${title}/day/${dayOfWeek}`
    );
    return response.data;
  },

  // Recupera per tipo pasto
  getByMealType: async (patientId, title, mealType) => {
    const response = await api.get(
      `${DIET_API_URL}/diet-plans/patient/${patientId}/plan/${title}/meal-type/${mealType}`
    );
    return response.data;
  },

  // ==================== Batch Operations ====================
  
  // Crea elementi in batch
  createBatch: async (elements) => {
    const response = await api.post(`${DIET_API_URL}/diet-plans/batch`, elements);
    return response.data;
  },

  // Elimina elementi in batch
  deleteBatch: async (ids) => {
    await api.delete(`${DIET_API_URL}/diet-plans/batch`, { data: ids });
    return true;
  },

  // ==================== Helper Functions ====================
  
  // Formatta i dati del piano per la visualizzazione
  formatPlanData: (planItems) => {
    const grouped = {
      byDay: {},
      byMealType: {},
      totalNutrition: {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0
      }
    };

    planItems.forEach(item => {
      // Raggruppa per giorno
      if (!grouped.byDay[item.dayOfWeek]) {
        grouped.byDay[item.dayOfWeek] = [];
      }
      grouped.byDay[item.dayOfWeek].push(item);

      // Raggruppa per tipo pasto
      if (!grouped.byMealType[item.mealType]) {
        grouped.byMealType[item.mealType] = [];
      }
      grouped.byMealType[item.mealType].push(item);

      // Calcola totali nutrizionali
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

    if (!data.patientId) {
      errors.patientId = 'Paziente richiesto';
    }

    if (!data.title || !data.title.trim()) {
      errors.title = 'Titolo richiesto';
    }

    if (!data.dayOfWeek || data.dayOfWeek < 1 || data.dayOfWeek > 7) {
      errors.dayOfWeek = 'Giorno non valido (1-7)';
    }

    if (!data.mealType) {
      errors.mealType = 'Tipo pasto richiesto';
    }

    if (!data.foodId) {
      errors.foodId = 'Alimento richiesto';
    }

    if (!data.quantity || data.quantity <= 0) {
      errors.quantity = 'Quantità deve essere positiva';
    }

    if (!data.unit) {
      errors.unit = 'Unità di misura richiesta';
    }

    return errors;
  },

  // Costanti per i tipi di pasto
  MEAL_TYPES: {
    COLAZIONE: 'Colazione',
    SPUNTINO_MATTINA: 'Spuntino Mattina',
    PRANZO: 'Pranzo',
    MERENDA: 'Merenda',
    CENA: 'Cena',
    SPUNTINO_SERA: 'Spuntino Sera'
  },

  // Costanti per i giorni della settimana
  DAYS_OF_WEEK: {
    1: 'Lunedì',
    2: 'Martedì',
    3: 'Mercoledì',
    4: 'Giovedì',
    5: 'Venerdì',
    6: 'Sabato',
    7: 'Domenica'
  },

  // Ottieni nome del giorno
  getDayName: (dayIndex) => {
    return dietService.DAYS_OF_WEEK[dayIndex] || `Giorno ${dayIndex}`;
  },

  // Ottieni nome del tipo pasto
  getMealTypeName: (mealType) => {
    return dietService.MEAL_TYPES[mealType] || mealType;
  }
};