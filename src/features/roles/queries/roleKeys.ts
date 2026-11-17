export const roleKeys = {
    all: ["roles"] as const,
    list: () => [...roleKeys.all] as const,
};