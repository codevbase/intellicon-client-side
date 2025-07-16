import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://intellicon-server.vercel.app',
  withCredentials: true, // Always send cookies (including httpOnly JWT)
});

// No need for a request interceptor to attach Firebase ID token for every request.
// Only attach the ID token manually when calling the /jwt endpoint after login/register.

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle 401/403 errors globally
    return Promise.reject(error);
  }
);

export default axiosSecure;
