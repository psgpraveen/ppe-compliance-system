export interface Violation {
  id: string;
  detected_at: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  image_url: string;
  remarks: string | null;
  employee_code: string;
  first_name: string;
  last_name: string;
  violation_type_name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  supervisor_first_name: string | null;
  supervisor_last_name: string | null;
  department_name: string | null;
}

export interface ViolationFilters {
  status?: string;
  employee_code?: string;
  violation_type_code?: string;
  date_from?: string;
  date_to?: string;
}
