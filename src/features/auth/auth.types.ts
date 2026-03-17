export interface LoginPayload {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterPayload {
    userName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface UserProfile {
    userId: number;
    userName: string;
    email: string;
    roleName: Role;
    permissions: string[];
}

export type Role = "admin" | "staff" | "user";

export interface ApiResponse<T> {
    isSuccess: boolean;
    isError: boolean;
    data: T;
    message: string;
}

export interface AuthSession {
    userInfo: UserProfile;
    token: string;
    expireToken: string;
}
