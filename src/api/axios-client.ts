import axios, { type AxiosError } from "axios";
import queryClient from "@/query-client";
import { authKeys } from "@/features/auth/queries";
import type { AuthSession } from "@/features/auth/auth.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = "/api";

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
            const session = queryClient.getQueryData<AuthSession | null>(
                authKeys.me(),
            );
            const hasSession = Boolean(session?.userInfo);
            const hasAuthHeader = Boolean(
                error.config?.headers?.Authorization ??
                error.config?.headers?.authorization,
            );

            if (!hasSession && !hasAuthHeader) {
                return Promise.reject(error);
            }

            queryClient.setQueryData(authKeys.me(), null);

            const roleName = session?.userInfo?.roleName;
            const loginPath =
                roleName === "admin" || roleName === "staff"
                    ? "/admin/login"
                    : "/login";

            const currentPath = window.location.pathname;
            if (
                !currentPath.startsWith("/login") &&
                !currentPath.startsWith("/admin/login")
            ) {
                window.location.assign(loginPath);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
