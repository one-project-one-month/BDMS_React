export interface LoginPayload {
    email: string;
    password: string;
    rememberMe?: boolean;
    mode?: AuthMode;
}

export interface RegisterPayload {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserProfile {
    userId: number;
    userName: string;
    email: string;
    roleName: Role;
    permissions: string[];
    donor?: DonorProfile | null;
}

export type DonorProfile = unknown;

export type Role = "admin" | "staff" | "user" | "donor";
export type AuthMode = "admin" | "user";

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
