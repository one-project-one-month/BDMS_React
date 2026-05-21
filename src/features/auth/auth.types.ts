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

export interface DonorProfile {
    id: number;
    userId: number;
    nicNo: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    lastDonationDate: string | null;
    remarks: string | null;
    emergencyContact: string | null;
    emergencyPhone: string | null;
    address: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type Role = "admin" | "staff" | "user";
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
