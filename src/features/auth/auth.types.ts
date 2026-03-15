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

// TODO: Fix with database User structure
export interface UserProfile {
    name?: string;
    email?: string;
    role?: Role;
}

export type Role = "admin" | "staff" | "user";

export interface ApiResponse<T> {
    success: number;
    code: number;
    data: T;
    message: string;
}