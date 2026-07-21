export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  department_id: string;
  department_name: string; // from JOIN
  supervisor_id: string | null;
  job_profile: string | null;
  mobile_number: string | null;
  aadhar_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
