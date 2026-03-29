export const AUTH_ENDPOINTS = {
    ADMIN_PROFILE: "/Auth/me",
    USER_PROFILE: "/UserAuth/me",
    ADMIN_LOGIN: "/Auth/login",
    ADMIN_LOGOUT: "/Auth/logout",
    USER_LOGIN: "/UserAuth/login",
    USER_LOGOUT: "/UserAuth/logout",
    USER_REGISTER: "/UserAuth/register",
} as const;
