// Authentication Service for IoT Gateway
export interface LoginRequest {
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

export interface ApiError {
  message: string;
  status?: number;
  type?: 'INVALID_CREDENTIALS' | 'INVALID_EMAIL' | 'INVALID_PASSWORD' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'UNKNOWN';
}

class AuthService {
  private baseUrl = 'http://localhost:5244';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('AuthService: Making login request to', `${this.baseUrl}/api/Auth/login`);
      console.log('AuthService: Request body:', JSON.stringify(credentials));
      const response = await fetch(`${this.baseUrl}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',  // Changed from text/plain
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('AuthService: Response status:', response.status);
      
      if (!response.ok) {
        let errorText = '';
        let errorData: any = null;
        
        try {
          errorText = await response.text();
          // Try to parse as JSON if possible
          if (errorText.trim().startsWith('{')) {
            errorData = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.warn('Could not parse error response as JSON');
        }

        console.error('AuthService: Login failed with status', response.status, errorText);
        
        // Create specific error based on status code and message
        const apiError: ApiError = {
          message: errorData?.message || errorText || 'Login failed',
          status: response.status,
          type: this.determineErrorType(response.status, errorData?.message || errorText)
        };
        
        throw apiError;
      }

      const data: LoginResponse = await response.json();
      console.log('AuthService: Login response data:', { success: data.success, username: data.username });
      
      if (!data.success) {
        const apiError: ApiError = {
          message: data.message || 'Login failed',
          status: response.status,
          type: this.determineErrorType(response.status, data.message || '')
        };
        throw apiError;
      }

      return data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      
      // If it's already an ApiError, re-throw it
      if (error && typeof error === 'object' && 'type' in error) {
        throw error;
      }
      
      // Handle network errors or other unexpected errors
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error during login',
        type: 'NETWORK_ERROR'
      };
      throw apiError;
    }
  }

  private determineErrorType(status: number, message: string): ApiError['type'] {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific error patterns
    if (lowerMessage.includes('invalid password') || lowerMessage.includes('incorrect password') || lowerMessage.includes('wrong password')) {
      return 'INVALID_PASSWORD';
    }
    
    if (lowerMessage.includes('invalid email') || lowerMessage.includes('email not found') || lowerMessage.includes('user not found')) {
      return 'INVALID_EMAIL';
    }
    
    if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('authentication failed')) {
      return 'INVALID_CREDENTIALS';
    }
    
    // Check by status code
    switch (status) {
      case 401:
        return 'INVALID_CREDENTIALS';
      case 400:
        return 'INVALID_CREDENTIALS';
      case 500:
      case 502:
      case 503:
        return 'SERVER_ERROR';
      default:
        return 'UNKNOWN';
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/Auth/refresh`, {
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  async logout(token: string | null): Promise<void> {
    try {
      if (!token) {
        console.log('AuthService: No token provided for logout, skipping API call');
        return;
      }

      console.log('AuthService: Making logout request to backend');
      const response = await fetch(`${this.baseUrl}/api/Auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('AuthService: Backend logout failed with status', response.status);
      } else {
        console.log('AuthService: Backend logout successful');
      }
    } catch (error) {
      console.warn('AuthService: Logout API call failed', error);
      // Don't throw error - local logout should still proceed
    }
  }

  isTokenExpired(expiration: string): boolean {
    const expirationDate = new Date(expiration);
    const now = new Date();
    return now >= expirationDate;
  }
}

export const authService = new AuthService();