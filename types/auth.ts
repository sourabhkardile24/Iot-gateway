// Type definitions for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  username: string;
  roles: string[];
  expiration: string;
  message: string;
}

export interface User {
  username: string;
  email: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}