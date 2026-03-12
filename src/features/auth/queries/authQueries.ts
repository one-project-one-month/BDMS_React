import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { getCurrentUser, login, logout, register } from "../api/api";
import type { UserProfile } from "../auth.types";
import { authKeys } from "./authKeys";

/**
 * Query: current authenticated user.
 */
export const currentUserQueryOptions = queryOptions<UserProfile | null>({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
});

/**
 * Mutation: register new user.
 */
export const registerMutationOptions = mutationOptions<
    UserProfile,
    unknown,
    Parameters<typeof register>[0]
>({
    mutationFn: register,
});

/**
 * Mutation: login user.
 */
export const loginMutationOptions = mutationOptions<
    UserProfile,
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