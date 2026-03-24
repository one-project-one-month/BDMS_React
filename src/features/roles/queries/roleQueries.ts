import { queryOptions } from "@tanstack/react-query";
import { getRoles } from "../api/role.api";
import type { Role } from "../role.types";
import { roleKeys } from "./roleKeys";

/**
 * Query: get all roles.
 */
export const getRolesQueryOptions = queryOptions<Role[] | null>({
    queryKey: roleKeys.list(),
    queryFn: getRoles,
});