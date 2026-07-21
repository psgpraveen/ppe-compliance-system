export interface EmployeeRow {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  department_id: string;
  supervisor_id: string | null;
  job_profile: string | null;
  mobile_number: string | null;
  aadhar_number: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeWithDepartmentRow extends EmployeeRow {
  department_name: string;
}

export interface CreateEmployeeDTO {
  employeeCode: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  supervisorId?: string;
  jobProfile?: string;
  mobileNumber?: string;
  aadharNumber?: string;
}

export interface UpdateEmployeeDTO {
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  supervisorId?: string;
  jobProfile?: string;
  mobileNumber?: string;
  aadharNumber?: string;
  isActive?: boolean;
}

export interface BulkImportEmployeeDTO {
  employeeCode: string;
  firstName: string;
  lastName: string;
  departmentName: string; // The raw name from excel
  jobProfile?: string;
  mobileNumber?: string;
  aadharNumber?: string;
}
