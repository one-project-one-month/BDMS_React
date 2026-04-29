// src/features/certificates/certificates.types.ts
export interface Certificate {
  id: number;
  donorId: number;
  userId?: number;
  certificateTitle: string;
  certificateDescription: string;
  createdAt?: string;
  issuedAt?: string;
}

export interface GenerateCertificatePayload {
  donorId: number;
  certificateTitle: string;
  certificateDescription: string;
}

export interface Donor {
  donorId: number;
  userId?: number;
  donorName?: string;
  completedDonationCount?: number;
}