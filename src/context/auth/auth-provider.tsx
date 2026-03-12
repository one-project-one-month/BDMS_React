import { useCallback, useMemo, type PropsWithChildren } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext, type AuthContextType } from "./auth-context";
import {
  authKeys,
  currentUserQueryOptions,
  loginMutationOptions,
  logoutMutationOptions,
} from "@/features/auth/queries";
import type { LoginPayload } from "@/features/auth/auth.types";

export default function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const { data: user, isPending } = useQuery({
    ...currentUserQueryOptions,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    ...loginMutationOptions,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });

  const logoutMutation = useMutation({
    ...logoutMutationOptions,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me(), null);
    },
  });

  const login = useCallback(
    async (credentials: LoginPayload) => {
      return await loginMutation.mutateAsync(credentials);
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value: AuthContextType = useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user,
      isInitializing: isPending && user === undefined,
      login,
      logout,
    }),
    [user, isPending, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
