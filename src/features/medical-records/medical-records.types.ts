export interface MedicalRecord {
  id: number;
  donationId: number;
  hospitalId: number;
  hemoglobinLevel: number;
  hivResult: number;
  hepatitisBResult: number;
  hepatitisCResult: number;
  malariaResult: number;
  syphilisResult: number;
  screeningStatus: number;
  screeningNotes: string;
  screenedBy: number;
  screeningAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface StoreMedicalRecordPayload {
  id?: number;
  donationId: number;
  hospitalId: number;
  hemoglobinLevel: number;
  hivResult: number;
  hepatitisBResult: number;
  hepatitisCResult: number;
  malariaResult: number;
  syphilisResult: number;
  screeningStatus: number;
  screeningNotes: string;
  screenedBy: number;
  screeningAt: string;
}

export interface UpdateMedicalRecordPayload
  extends StoreMedicalRecordPayload {
  id: number;
}
