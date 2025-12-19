import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
};

// Restaurant API
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
};

// Booking API
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  getAll: () => api.get('/bookings'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

// Menu API
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/menu/restaurant/${restaurantId}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  updateItem: (itemId, data) => api.put(`/cart/item/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart'),
};

export default api;