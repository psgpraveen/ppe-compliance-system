export interface DepartmentRow {
  id: string;
  site_id: string;
  supervisor_id: string | null;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDepartmentDTO {
  siteId: string;
  name: string;
  supervisorId?: string;
}

export interface UpdateDepartmentDTO {
  siteId?: string;
  name?: string;
  supervisorId?: string;
}
