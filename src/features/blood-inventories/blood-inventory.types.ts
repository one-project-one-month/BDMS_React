export type BloodInventoryStatus = 'Available' | 'Expired' | 'Used';

export interface BloodInventory {
  id: number;
  donationId: number;
  hospitalId: number;
  bloodGroup: string;
  units: number;
  collectedAt?: string | null;
  expiredAt?: string | null;
  status: BloodInventoryStatus;
  requestId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableStock {
  hospitalId: number;
  bloodGroup: string;
  totalUnits: number;
  availableCount: number;
}

export interface ConsumeBloodPayload {
  inventoryId: number;
  requestId: number;
}
