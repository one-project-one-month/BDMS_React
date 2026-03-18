import api from "@/api/axios-client";
import { AUTH_ENDPOINTS } from "@/api/endpoints/auth.endpoints";
import type {
    ApiResponse,
    AuthSession,
    LoginPayload,
    RegisterPayload,
} from "@/features/auth/auth.types";
import { isAxiosError } from "axios";

const getLoginEndpoint = (mode: LoginPayload["mode"]) =>
    mode === "admin" ? AUTH_ENDPOINTS.ADMIN_LOGIN : AUTH_ENDPOINTS.USER_LOGIN;

const getLogoutEndpoint = (mode: LoginPayload["mode"]) =>
    mode === "admin" ? AUTH_ENDPOINTS.ADMIN_LOGOUT : AUTH_ENDPOINTS.USER_LOGOUT;

/**
 * Register a new user.
 *
 * Sends registration data to the backend and returns
 * the API response containing the user profile and token.
 */
export const register = async (
    payload: RegisterPayload,
): Promise<AuthSession> => {
    const { data } = await api.post<ApiResponse<AuthSession>>(
        AUTH_ENDPOINTS.USER_REGISTER,
        payload,
    );

    if (!data.isSuccess || data.isError) {
        throw new Error(data.message || "Registration failed");
    }

    return data.data;
};

/**
 * Login a user.
 *
 * Returns the authenticated user's session info
 * (profile + token).
 */
export const login = async (
    payload: LoginPayload,
): Promise<AuthSession> => {
    const { mode = "user", ...body } = payload;
    const { data } = await api.post<ApiResponse<AuthSession>>(
        getLoginEndpoint(mode),
        body,
    );

    if (!data.isSuccess || data.isError) {
        throw new Error(data.message || "Login failed");
    }

    return data.data;
};

/**
 * Logout the current user.
 *
 * Invalidates the current session cookie on the server.
 */
export const logout = async (
    mode: LoginPayload["mode"] = "user",
): Promise<void> => {
    await api.post(getLogoutEndpoint(mode));
};

/**
 * Fetch the currently authenticated user.
 *
 * Uses the stored token (if available) to retrieve the user's profile
 * from the backend.
 */
export const getCurrentSession = async (): Promise<AuthSession | null> => {
    try {
        const { data } = await api.get<ApiResponse<AuthSession>>(
            AUTH_ENDPOINTS.PROFILE,
        );

        if (!data.isSuccess || data.isError) {
            return null;
        }

        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            return null;
        }
        throw error;
    }
};
