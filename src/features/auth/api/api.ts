import api from "@/api/axios-client";
import { AUTH_ENDPOINTS } from "@/api/endpoints/auth.endpoints";
import type {
    ApiResponse,
    LoginPayload,
    RegisterPayload,
    UserProfile,
} from "@/features/auth/auth.types";
import { isAxiosError } from "axios";

/**
 * Register a new user.
 *
 * Sends registration data to the backend and returns
 * the API response containing the created user profile.
 */
export const register = async (
    payload: RegisterPayload,
): Promise<UserProfile> => {
    const { data } = await api.post<ApiResponse<UserProfile>>(
        AUTH_ENDPOINTS.REGISTER,
        payload,
    );

    return data.data;
};

/**
 * Login a user.
 *
 * The backend will create an HTTP-only cookie session.
 * Returns the authenticated user's profile.
 */
export const login = async (
    payload: LoginPayload,
): Promise<UserProfile> => {
    const { data } = await api.post<ApiResponse<UserProfile>>(
        AUTH_ENDPOINTS.LOGIN,
        payload,
    );

    return data.data;
};

/**
 * Logout the current user.
 *
 * Invalidates the current session cookie on the server.
 */
export const logout = async (): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
};

/**
 * Fetch the currently authenticated user.
 *
 * Uses the session cookie automatically sent by the browser
 * to retrieve the user's profile from the backend.
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
        const { data } = await api.get<ApiResponse<UserProfile>>(
            AUTH_ENDPOINTS.PROFILE,
        );
        return data.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            return null;
        }
        throw error;
    }
};
