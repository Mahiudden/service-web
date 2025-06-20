import axios from 'axios';
//  https://elite-one-omega.vercel.app
const API_BASE_URL = 'https://elite-one-omega.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.patch('/auth/profile', profileData),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
};

// Add Money API
export const addMoneyAPI = {
  createRequest: (requestData) => api.post('/add-money', requestData),
  getMyRequests: () => api.get('/add-money/my-requests'),
  getAllRequests: () => api.get('/add-money'),
  updateRequestStatus: (requestId, status) => api.patch(`/add-money/${requestId}/status`, { status }),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUser: (userId) => api.get(`/admin/users/${userId}`),
  updateUserBalance: (userId, balance) => api.patch(`/admin/users/${userId}/balance`, { balance }),
  updateUserPassword: (userId, password) => api.patch(`/admin/users/${userId}/password`, { password }),
  updateUserInfo: (userId, userData) => api.patch(`/admin/users/${userId}/info`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  updateProfile: (profileData) => api.patch('/admin/profile', profileData),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
};

// Services API
export const servicesAPI = {
  getAllServices: () => api.get('/services'),
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (serviceData) => api.post('/services', serviceData),
  updateService: (id, serviceData) => api.patch(`/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/services/${id}`),
};

export default api; 