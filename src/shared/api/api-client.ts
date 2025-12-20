import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

// Just boilerplate setup needs to be done correctly
type TypedApi = Omit<AxiosInstance, "get" | "post" | "put" | "patch" | "delete"> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

// Creates Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}) as TypedApi;

// Auto inject Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwraps data and handles errors
api.interceptors.response.use(
  (response) => response.data, // Returns data directly
  (error) => {
    // TODO: Need to add global error handling stuff here
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);
