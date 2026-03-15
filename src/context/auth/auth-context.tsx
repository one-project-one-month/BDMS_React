import { createContext } from "react";
import type { LoginPayload, UserProfile } from "@/features/auth/auth.types";

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
