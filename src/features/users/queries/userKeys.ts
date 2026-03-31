export const userKeys = {
    all: ["users"] as const,
    list: () => [...userKeys.all] as const,
    detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};