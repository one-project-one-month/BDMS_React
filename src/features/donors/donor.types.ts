export interface Donor {
  id: number;
  userId: number;
  nicNo: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  lastDonationDate: string;
  remarks: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  isActive: boolean;
}

export interface StoreDonorPayload {
  userId: number;
  nicNo: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  lastDonationDate: string | null;
  remarks?: string | undefined;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  isActive: boolean;
}

export interface UpdateDonorPayload extends StoreDonorPayload {
  id: number;
}

export interface DeleteDonorPayload {
  id: number;
}
