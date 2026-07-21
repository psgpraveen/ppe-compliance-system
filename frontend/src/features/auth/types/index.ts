export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
