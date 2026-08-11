import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Network error. Please check your connection.';
    return Promise.reject(new Error(message));
  }
);

// ─── Farm API ─────────────────────────────────────────────────────────────────
export const farmAPI = {
  /** Fetch full farm state (user + all plots) */
  getFarm: () => api.get('/farm'),

  /** Plant a crop: { plotIndex, cropType } */
  plantCrop: (plotIndex, cropType) =>
    api.post('/plant', { plotIndex, cropType }),

  /** Harvest a crop: { plotIndex } */
  harvestCrop: (plotIndex) =>
    api.post('/harvest', { plotIndex }),

  /** Refill water to 100% */
  waterFarm: () => api.post('/water'),

  /** Get analytics stats */
  getStats: () => api.get('/stats'),

  /** Get AI advisor recommendations */
  getAdvisor: () => api.get('/advisor'),
};

export default api;
