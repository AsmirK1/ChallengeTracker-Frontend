import axios from "axios";

// Just boilerplate setup needs to be done correctly

// Creates Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
