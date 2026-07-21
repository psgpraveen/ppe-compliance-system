export interface SupervisorRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'SUPERVISOR';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSupervisorDTO {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface UpdateSupervisorDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
}
