import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { User } from "../user.types";
import { userKeys } from "./userKeys";
import { activateUser, deactivateUser, deleteUser, getUser, getUsers, storeUser, updateUser } from "../api/user.api";

/**
 * Query: get all users.
 */
export const getUsersQueryOptions = queryOptions<User[]>({
    queryKey: userKeys.list(),
    queryFn: getUsers,
});

/**
 * Query: get specific user.
 */
export const getUserQueryOptions = (id: number) => queryOptions<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
})

/**
 * Mutation: create user record.
 */
export const createUserMutationOptions = mutationOptions<
    User,
    unknown,
    Parameters<typeof storeUser>[0]
>({
    mutationFn: storeUser,
});

/**
 * Mutation: update user record.
 */
export const updateUserMutationOptions = mutationOptions<
    User,
    unknown,
    Parameters<typeof updateUser>[0]
>({
    mutationFn: updateUser,
})

/**
 * Mutation: delete user record.
 */
export const deleteUserMutationOptions = mutationOptions<
    boolean,
    unknown,
    Parameters<typeof deleteUser>[0]
>({
    mutationFn: deleteUser,
})

/**
 * Mutation: activate user.
 */
export const activateUserMutationOptions = mutationOptions<
    User,
    unknown,
    Parameters<typeof activateUser>[0]
>({
    mutationFn: activateUser,
});

/**
 * Mutation: deactivate user.
 */
export const deactivateUserMutationOptions = mutationOptions<
    User,
    unknown,
    Parameters<typeof deactivateUser>[0]
>({
    mutationFn: deactivateUser,
});