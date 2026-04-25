import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.110:8000/api/',
});

// Request interceptor for adding the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
