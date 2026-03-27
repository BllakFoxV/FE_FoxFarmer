import axios from 'axios';

const apiClient = axios.create({
  // Tự động nhận diện môi trường
  baseURL: import.meta.env.DEV 
    ? import.meta.env.VITE_API_PROXY_PREFIX 
    : import.meta.env.VITE_API_BASE_URL,
  // Thêm fallback 10000ms nhỡ file .env quên khai báo biến này nó lại ra NaN
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor: Nơi xử lý Log hoặc gắn Token bảo mật tập trung
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Global Error Handling: Tự động bắn Toast khi server sập
    const message = error.response?.data?.detail || "Hệ thống đang bảo trì";
    console.error(`[API ERROR]: ${message}`);
    return Promise.reject(error);
  }
);

export default apiClient;