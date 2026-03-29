import { createContext } from "react";
import type {
  AuthSession,
  LoginPayload,
  UserProfile,
} from "@/features/auth/auth.types";

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
