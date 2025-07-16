import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
