export interface ViolationTypeRow {
  id: string;
  code: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateViolationTypeDTO {
  code: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  is_active?: boolean;
}

export interface UpdateViolationTypeDTO {
  code?: string;
  name?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  is_active?: boolean;
}
