export interface ViolationStats {
  pending: number;
  escalated: number;
  acknowledged: number;
  resolved: number;
  total: number;
}

export interface RecentViolation {
  id: string;
  detected_at: string;
  status: 'PENDING' | 'ESCALATED' | 'ACKNOWLEDGED' | 'RESOLVED';
  first_name: string;
  last_name: string;
  employee_code: string;
  violation_type_name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface DashboardStats {
  totalSites: number;
  totalDepartments: number;
  totalEmployees: number;
  violations: ViolationStats;
  recentViolations: RecentViolation[];
}
