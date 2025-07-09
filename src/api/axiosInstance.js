import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if you need to send cookies
});

// Optional: Add interceptors for auth or error handling
// axiosInstance.interceptors.request.use(config => {
//   // Add auth token if needed
//   return config;
// }, error => Promise.reject(error));

// axiosInstance.interceptors.response.use(
//   response => response,
//   error => Promise.reject(error)
// );

export default axiosInstance;