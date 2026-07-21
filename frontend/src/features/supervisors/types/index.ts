export interface Supervisor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'SUPERVISOR';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
