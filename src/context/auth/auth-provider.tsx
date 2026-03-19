import {
  useCallback,
  useLayoutEffect,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext, type AuthContextType } from "./auth-context";
import {
  authKeys,
  currentUserQueryOptions,
  loginMutationOptions,
  logoutMutationOptions,
} from "@/features/auth/queries";
import type { LoginPayload } from "@/features/auth/auth.types";
import api from "@/api/axios-client";

export default function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const { data: session, isPending } = useQuery({
    ...currentUserQueryOptions,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    ...loginMutationOptions,
  });

  const logoutMutation = useMutation({
    ...logoutMutationOptions,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me(), null);
    },
  });

  const login = useCallback(
    async (credentials: LoginPayload) => {
      const session = await loginMutation.mutateAsync(credentials);
      queryClient.setQueryData(authKeys.me(), session);
      return session;
    },
    [loginMutation, queryClient],
  );

  const logout = useCallback(async () => {
    const mode =
      session?.userInfo.roleName === "admin" ||
      session?.userInfo.roleName === "staff"
        ? "admin"
        : "user";
    await logoutMutation.mutateAsync(mode);
  }, [logoutMutation, session?.userInfo.roleName]);

  const user = session?.userInfo ?? null;

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isInitializing: isPending && session === undefined,
      login,
      logout,
    }),
    [user, isPending, session, login, logout],
  );

  useLayoutEffect(() => {
    if (session?.token) {
      api.defaults.headers.common.Authorization = `Bearer ${session.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [session?.token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
