export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR';
  first_name?: string;
  last_name?: string;
  departmentName?: string;
  siteName?: string;
  siteLocation?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
