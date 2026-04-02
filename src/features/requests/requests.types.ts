export interface BloodRequest {
  id: number;
  patientName: string;
  bloodType: string;
  hospitalName: string;
  address: string;
  numberOfUnits: number;
  requiredDate: Date;
  requestType: "emergency" | "pre-booked";
  relationshipToPatient: string;
  contactNumber: string;
  reasonForRequest: string;
  additionalNotes?: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBloodRequestPayload {
  patientName: string;
  bloodType: string;
  hospitalName: string;
  address: string;
  numberOfUnits: number;
  requiredDate: Date;
  requestType: "emergency" | "pre-booked";
  relationshipToPatient: string;
  contactNumber: string;
  reasonForRequest: string;
  additionalNotes?: string;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    isError: boolean;
    data: T;
    message: string;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}