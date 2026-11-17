export interface BloodStockItem {
  bloodGroup: string;
  units: number;
}

export interface MonthlyTrendItem {
  month: string;
  donations: number;
  requests: number;
}

export interface AdminDashboardData {
  totalDonors: number;
  totalDonations: number;
  totalBloodRequests: number;
  bloodStock: BloodStockItem[];
  monthlyTrends: MonthlyTrendItem[];
}
