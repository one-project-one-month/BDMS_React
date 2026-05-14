export const certificateKeys = {
    all: ["certificates"] as const,
    listAll: () => [...certificateKeys.all, "list"] as const,
    list: (donorId: number | string) => [...certificateKeys.all, { donorId }] as const,
    detail: (id: number | string) => [...certificateKeys.all, id] as const,
};