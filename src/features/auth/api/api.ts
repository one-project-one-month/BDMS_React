/** @author Khant Loon Thu */

import { HAS_API_BASE_URL } from "@/api/axios-client";
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

const MOCK_AUTH_STORAGE_KEY = "bdms.mock-auth-session";
const MOCK_ADMIN_EMAIL = "admin@bdms.com";
const MOCK_ADMIN_PASSWORD = "Admin@123";

const createMockAdminSession = (): AuthSession => ({
  userInfo: {
    userId: 1,
    userName: "Admin BDMS",
    email: MOCK_ADMIN_EMAIL,
    roleName: "admin",
    permissions: [
      "users.read",
      "users.write",
      "bloodRequests.read",
      "bloodRequests.write",
    ],
    donor: null,
  },
  token: "mock-admin-token",
  expireToken: "",
});

const readMockSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
    return null;
  }
};

const writeMockSession = (session: AuthSession) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(session));
};

const clearMockSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
};

const tryMockAdminLogin = (payload: LoginPayload): AuthSession | null => {
  if (
    payload.mode !== "admin" ||
    payload.email !== MOCK_ADMIN_EMAIL ||
    payload.password !== MOCK_ADMIN_PASSWORD
  ) {
    return null;
  }

  const session = createMockAdminSession();
  writeMockSession(session);
  return session;
};

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
  if (!HAS_API_BASE_URL) {
    const mockSession = tryMockAdminLogin(payload);
    if (mockSession) {
      return mockSession;
    }

    throw new Error("Invalid email or password");
  }

  const { mode = "user", ...body } = payload;
  try {
    const { data } = await api.post<ApiResponse<AuthSession>>(
      getLoginEndpoint(mode),
      body,
    );

    if (!data.isSuccess || data.isError) {
      throw new Error(data.message || "Login failed");
    }

    return data.data;
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      const mockSession = tryMockAdminLogin(payload);
      if (mockSession) {
        return mockSession;
      }
    }

    throw error;
  }
};

/** Logout and invalidate the server session cookie. */
export const logout = async (
  mode: LoginPayload["mode"] = "user",
): Promise<void> => {
  if (readMockSession()) {
    clearMockSession();
    return;
  }

  if (!HAS_API_BASE_URL) {
    return;
  }

  await api.post(getLogoutEndpoint(mode));
};

/** Fetch the current session using the route-based /me. */
export const getCurrentSession = async (): Promise<AuthSession | null> => {
  if (!HAS_API_BASE_URL) {
    return readMockSession();
  }

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
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || !error.response) {
        return readMockSession();
      }
    }
    throw error;
  }
};
