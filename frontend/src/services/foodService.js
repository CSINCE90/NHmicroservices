import api from './api';
import { FOOD_API_URL } from '../utils/constants';

export const foodService = {
  // Alimenti - CRUD Operations
  getAllFoods: async () => {
    const response = await api.get(`${FOOD_API_URL}/foods`);
    return response.data;
  },

  getFood: async (id) => {
    const response = await api.get(`${FOOD_API_URL}/foods/${id}`);
    return response.data;
  },

  createFood: async (foodData) => {
    const response = await api.post(`${FOOD_API_URL}/foods`, foodData);
    return response.data;
  },

  updateFood: async (id, foodData) => {
    const response = await api.put(`${FOOD_API_URL}/foods/${id}`, foodData);
    return response.data;
  },

  deleteFood: async (id) => {
    await api.delete(`${FOOD_API_URL}/foods/${id}`);
  },

  // Ricerca avanzata alimenti
  searchFoods: async (searchParams) => {
    const response = await api.get(`${FOOD_API_URL}/foods/search`, {
      params: searchParams
    });
    return response.data;
  },

  // Ricerca semplice per nome
  searchFoodsByName: async (name) => {
    return await foodService.searchFoods({ name });
  },

  // Ricerca per range calorico
  searchFoodsByCalories: async (minCal, maxCal) => {
    return await foodService.searchFoods({ minCal, maxCal });
  },

  // Ricerca per range proteine
  searchFoodsByProtein: async (minProt, maxProt) => {
    return await foodService.searchFoods({ minProt, maxProt });
  },

  // Ricerca per range carboidrati
  searchFoodsByCarbs: async (minCarb, maxCarb) => {
    return await foodService.searchFoods({ minCarb, maxCarb });
  },

  // Ricerca per range grassi
  searchFoodsByFat: async (minFat, maxFat) => {
    return await foodService.searchFoods({ minFat, maxFat });
  },
};