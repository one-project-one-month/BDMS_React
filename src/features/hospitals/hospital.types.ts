export interface Hospital {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
