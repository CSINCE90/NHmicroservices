// frontend/src/utils/constants.js
export const API_BASE_URL = 'http://localhost';
export const AUTH_SERVICE_PORT = '8081';
export const PATIENT_SERVICE_PORT = '8082';
export const FOOD_SERVICE_PORT = '8083';
export const DIET_SERVICE_PORT = '8084';

export const AUTH_API_URL = `${API_BASE_URL}:${AUTH_SERVICE_PORT}/api/auth`;
export const PATIENT_API_URL = `${API_BASE_URL}:${PATIENT_SERVICE_PORT}/api`;
export const FOOD_API_URL = `${API_BASE_URL}:${FOOD_SERVICE_PORT}/api`;
export const DIET_API_URL = `${API_BASE_URL}:${DIET_SERVICE_PORT}/api/diet-plans`;

// Helper per costruire URL con parametri
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

// Costanti per i tipi di pasto
export const MEAL_TYPES = {
  COLAZIONE: 'Colazione',
  SPUNTINO_MATTINA: 'Spuntino Mattina',
  PRANZO: 'Pranzo',
  MERENDA: 'Merenda',
  CENA: 'Cena',
  SPUNTINO_SERA: 'Spuntino Sera'
};

// Costanti per i giorni della settimana
export const DAYS_OF_WEEK = {
  1: 'Lunedì',
  2: 'Martedì',
  3: 'Mercoledì',
  4: 'Giovedì',
  5: 'Venerdì',
  6: 'Sabato',
  7: 'Domenica'
};

// Costanti per le unità di misura
export const UNITS = {
  g: 'grammi',
  ml: 'millilitri',
  pz: 'pezzi',
  porzione: 'porzione',
  tazza: 'tazza',
  cucchiaio: 'cucchiaio',
  cucchiaino: 'cucchiaino'
};

// Costanti per i colori dei macronutrienti
export const MACRO_COLORS = {
  calories: '#ff5252',
  proteins: '#2196f3',
  carbs: '#ff9800',
  fats: '#4caf50'
};