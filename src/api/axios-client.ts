import axios, { type AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = "/api/v1";

if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined");
}

export const API_BASE = `${BASE_URL}${API_PREFIX}`;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});


/**
 * Response interceptor
 * Handles global API errors.
 */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn("401 - Unauthorized request - user session may be expired.");
        }
        return Promise.reject(error);
    }
);

export default api;