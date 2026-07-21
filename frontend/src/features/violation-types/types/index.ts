export interface ViolationType {
  id: string;
  code: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
