import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { getCurrentSession, login, logout, register } from "../api/api";
import type { AuthSession } from "../auth.types";
import { authKeys } from "./authKeys";

/**
 * Query: current authenticated user.
 */
export const currentUserQueryOptions = queryOptions<AuthSession | null>({
    queryKey: authKeys.me(),
    queryFn: getCurrentSession,
});

/**
 * Mutation: register new user.
 */
export const registerMutationOptions = mutationOptions<
    AuthSession,
    unknown,
    Parameters<typeof register>[0]
>({
    mutationFn: register,
});

/**
 * Mutation: login user.
 */
export const loginMutationOptions = mutationOptions<
    AuthSession,
    unknown,
    Parameters<typeof login>[0]
>({
    mutationFn: login,
});


/**
 * Mutation: logout user.
 */
export const logoutMutationOptions = mutationOptions({
    mutationFn: logout,
});
