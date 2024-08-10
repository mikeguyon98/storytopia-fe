import axios from 'axios';
import { useAuth } from './AuthProvider';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your FastAPI base URL
});

// Set up an interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const { currentUser } = useAuth(); // Retrieve the current user and token
    if (currentUser?.token) {
      config.headers.Authorization = `Bearer ${currentUser.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
