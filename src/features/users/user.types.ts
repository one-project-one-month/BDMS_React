export interface Role {
  roleId: number;
  roleName: string;
}

export interface Hospital {
  hospitalId: number;
  hospitalName: string;
}

export interface Donor {
  donorId: number;
}

export interface User {
  userId: number;
  role: Role;
  hospital: Hospital | null;
  username: string;
  email: string;
  isActive: boolean;
  donor: Donor | null;
}

export interface StoreUserPayload {
  username: string;
  email: string;
  password: string;
  userRoleId: number;
  userHospitalId: number | null;
}

export interface UpdateUserPayload {
  userId: number;
  username: string;
  email: string;
  userRoleId: number;
  userHospitalId: number | null;
}
