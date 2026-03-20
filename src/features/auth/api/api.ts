/** @author Khant Loon Thu */

import api from "@/api/axios-client";
import { AUTH_ENDPOINTS } from "@/api/endpoints/auth.endpoints";
import type {
  ApiResponse,
  AuthMode,
  AuthSession,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from "@/features/auth/auth.types";
import { isAxiosError } from "axios";

const getLoginEndpoint = (mode: LoginPayload["mode"]) =>
  mode === "admin" ? AUTH_ENDPOINTS.ADMIN_LOGIN : AUTH_ENDPOINTS.USER_LOGIN;

const getLogoutEndpoint = (mode: LoginPayload["mode"]) =>
  mode === "admin" ? AUTH_ENDPOINTS.ADMIN_LOGOUT : AUTH_ENDPOINTS.USER_LOGOUT;

const getProfileEndpoint = (mode: AuthMode) =>
  mode === "admin" ? AUTH_ENDPOINTS.ADMIN_PROFILE : AUTH_ENDPOINTS.USER_PROFILE;

/** 
 * Best-effort mode guess from the current path.
 * 
 * * Warning: This code is not ideal way to do in this case.
 * 
 * backend တွင် cookie-based middleware သုံးထားသောကြောင့် 
 * auth/me ခေါ်ရာတွင် တိုင်ပတ်နေသဖြင့်
 * /UserAuth/me နှင့် /Auth/me ကွဲပြားစေရန် rotue နှင့် စစ်ထားသည်။
 */
const getAuthModeFromPath = (): AuthMode => {
  if (typeof window === "undefined") {
    return "user";
  }

  return window.location.pathname.startsWith("/admin") ? "admin" : "user";
};

/** Register a new user and return the session. */
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

/** Login and return the session (profile + token). */
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

/** Logout and invalidate the server session cookie. */
export const logout = async (
  mode: LoginPayload["mode"] = "user",
): Promise<void> => {
  await api.post(getLogoutEndpoint(mode));
};

/** Fetch the current session using the route-based /me. */
export const getCurrentSession = async (): Promise<AuthSession | null> => {
  const mode = getAuthModeFromPath();

  try {
    const { data } = await api.get<ApiResponse<AuthSession | UserProfile>>(
      getProfileEndpoint(mode),
    );

    if (!data.isSuccess || data.isError) {
      return null;
    }

    /**
     * /me response တွင် token, expiredToken ပါမလာပါ။ ( TwT )
     * therefore: check if there'is userInfo in the payload
     * if so return the payload, otherwise return api response object
    */
    const payload = data.data;
    if ("userInfo" in payload) {
      return payload;
    }

    return {
      userInfo: payload,
      token: "",
      expireToken: "",
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};
