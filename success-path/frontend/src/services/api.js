import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const activityService = {
  logSteps: async (steps) => {
    return await api.post('/activities/', { activity_type: 'steps', steps });
  },

  logCalories: async (calories) => {
    return await api.post('/activities/', { activity_type: 'calories', calories });
  },

  getDailyStats: async () => {
    return await api.get('/activities/daily');
  },

  getWeeklyStats: async () => {
    return await api.get('/activities/weekly');
  },
};

export const contentService = {
  getDailyQuote: async () => {
    return await api.get('/quotes/daily');
  },

  getWorkoutMusic: async (genre) => {
    return await api.get(`/music/workout?genre=${genre}`);
  },

  getDietPlan: async (goals) => {
    return await api.get(`/diet/plan?goals=${goals}`);
  },
};

export default api;
