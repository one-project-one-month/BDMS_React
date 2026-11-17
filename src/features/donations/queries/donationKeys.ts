export const donationKeys = {
    all: ["donations"] as const,
    lists: () => [...donationKeys.all, "list"] as const,
    list: (filters: string) => [...donationKeys.lists(), { filters }] as const,
    details: () => [...donationKeys.all, "detail"] as const,
    detail: (id: number) => [...donationKeys.details(), id] as const,
}
