import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
const API_PREFIX = "/api/v1";

export const API_BASE = `${BASE_URL}${API_PREFIX}`;

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Request interceptor
 * Attaches the JWT token from localStorage
 * to every outgoing request if available.
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Response interceptor 
 * Handles API responses and global error handling.
 * If a 401 Unauthorized response is returned,
 * the stored token is removed.
 */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const { response } = error;
        if (response?.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export default api;