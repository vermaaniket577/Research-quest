import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create the Axios client
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Necessary for cross-site cookie transmission (refresh tokens)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token (from client cookies) to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Keep track of refresh requests to prevent multiple requests simultaneously
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Intercept 401s and attempt to silently refresh access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and that we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop if the refresh route itself fails with 401
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request if a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token (CORS/cookies will automatically handle sending the HTTP-only refresh token)
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.token;

        if (newAccessToken) {
          // Write the new access token to the standard cookie for Next.js middleware
          Cookies.set('token', newAccessToken, { expires: 7, path: '/' });

          // Update headers in axios instance and original request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error('Refresh token rotation failed to return access token');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear local state since authorization is lost
        Cookies.remove('token', { path: '/' });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          // Optional: redirect to login
          window.location.href = '/login?error=session_expired';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
