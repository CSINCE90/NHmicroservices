// frontend/src/services/dietService.js
import api from './api';
import { DIET_API_URL } from '../utils/constants';

export const dietService = {
  // Meal Plans - CRUD Operations
  getAllMealPlans: async () => {
    // Per ora usiamo un endpoint fittizio, dovrai implementarlo nel backend
    const response = await api.get(`${DIET_API_URL}/plans/all`);
    return response.data;
  },

  getMealPlansByPaziente: async (pazienteId) => {
    const response = await api.get(`${DIET_API_URL}/paziente/${pazienteId}`);
    return response.data;
  },

  getMealPlan: async (id) => {
    const response = await api.get(`${DIET_API_URL}/${id}`);
    return response.data;
  },

  createMealPlan: async (mealPlanData) => {
    const response = await api.post(`${DIET_API_URL}`, mealPlanData);
    return response.data;
  },

  updateMealPlanHeader: async (id, titolo, note) => {
    const response = await api.patch(`${DIET_API_URL}/${id}`, null, {
      params: { titolo, note }
    });
    return response.data;
  },

  deleteMealPlan: async (id) => {
    await api.delete(`${DIET_API_URL}/${id}`);
    return true;
  },

  // Meal Days - CRUD Operations
  getMealDay: async (dayId) => {
    const response = await api.get(`${DIET_API_URL}/days/${dayId}`);
    return response.data;
  },

  listMealDaysByPlan: async (planId) => {
    const response = await api.get(`${DIET_API_URL}/${planId}/days`);
    return response.data;
  },

  addOrGetMealDay: async (planId, dayIndex) => {
    const response = await api.post(`${DIET_API_URL}/${planId}/days/${dayIndex}`);
    return response.data;
  },

  updateMealDayIndex: async (dayId, dayIndex) => {
    const response = await api.patch(`${DIET_API_URL}/days/${dayId}`, null, {
      params: { dayIndex }
    });
    return response.data;
  },

  deleteMealDay: async (dayId) => {
    await api.delete(`${DIET_API_URL}/days/${dayId}`);
    return true;
  },

  // Meal Items - CRUD Operations
  getMealItem: async (itemId) => {
    const response = await api.get(`${DIET_API_URL}/items/${itemId}`);
    return response.data;
  },

  listMealItemsByDay: async (dayId) => {
    const response = await api.get(`${DIET_API_URL}/items/day/${dayId}`);
    return response.data;
  },

  createMealItem: async (dayId, mealItemData) => {
    const response = await api.post(`${DIET_API_URL}/items/${dayId}`, mealItemData);
    return response.data;
  },

  updateMealItem: async (itemId, mealItemData) => {
    const response = await api.patch(`${DIET_API_URL}/items/${itemId}`, mealItemData);
    return response.data;
  },

  deleteMealItem: async (itemId) => {
    await api.delete(`${DIET_API_URL}/items/${itemId}`);
    return true;
  }
};