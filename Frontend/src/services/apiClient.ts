import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://localhost:7009/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add access token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle token refresh and errors
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (!error.response) {
      return Promise.reject(new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.'));
    }

    const status = error.response.status;

    // Handle 401 Unauthorized (Token expired)
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Call refresh token endpoint (directly using axios to avoid loops)
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, 
            JSON.stringify(refreshToken), // Backend expects string body
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          processQueue(null, newAccessToken);
          isRefreshing = false;

          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          // Clear credentials and logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.dispatchEvent(new Event('auth-logout')); // Notify AuthContext
          return Promise.reject(new Error('Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.'));
        }
      } else {
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }

    // Extract business rule, validation, or unexpected error messages from C# Exception Middleware
    const errorData = error.response.data as any;
    let errorMessage = 'Beklenmeyen bir hata oluştu.';

    if (errorData) {
      if (errorData.type === 'ValidationError' && errorData.errors) {
        // Validation errors from FluentValidation
        const validationMsgs = errorData.errors.map((e: any) => e.errorMessage).join('\n');
        errorMessage = validationMsgs || 'Lütfen form verilerini kontrol edin.';
      } else if (errorData.message) {
        // BusinessRuleException, NotFoundException, ForbiddenException, etc.
        errorMessage = errorData.message;
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);
