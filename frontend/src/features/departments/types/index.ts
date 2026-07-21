export interface Department {
  id: string;
  site_id: string;
  supervisor_id: string | null;
  supervisor_first_name?: string;
  supervisor_last_name?: string;
  name: string;
  created_at: string;
  updated_at: string;
}
