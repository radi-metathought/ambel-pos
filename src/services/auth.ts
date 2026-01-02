import { apiService } from './api';

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    roles: string[];
  };
  navigate_to?: string;
  message?: string;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Admin login
   */
  async adminLogin(credentials: LoginCredentials, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        '/auth/dashboard/login',
        credentials
      );
      
      // Store admin token securely
      if (response.access_token) {
        // Extract expiration from token if available (JWT)
        const expiresIn = this.getTokenExpiration(response.access_token);
        apiService.setAdminToken(response.access_token, rememberMe, expiresIn);
      }
      
      // Store user data in sessionStorage (more secure than localStorage)
      if (response.user) {
        sessionStorage.setItem('adminUser', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Login failed',
        statusCode: error.response?.status,
      } as AuthError;
    }
  }

  /**
   * Regular user login
   */
  async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      
      // Store auth token securely
      if (response.access_token) {
        const expiresIn = this.getTokenExpiration(response.access_token);
        apiService.setAuthToken(response.access_token, rememberMe, expiresIn);
      }
      
      // Store user data in sessionStorage
      if (response.user) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Login failed',
        statusCode: error.response?.status,
      } as AuthError;
    }
  }

  /**
   * Logout admin
   */
  adminLogout(): void {
    apiService.clearAdminToken();
  }

  /**
   * Logout regular user
   */
  logout(): void {
    apiService.clearAuthToken();
    sessionStorage.removeItem('user');
    // Also clear from localStorage (migration)
    localStorage.removeItem('user');
  }

  /**
   * Check if admin is authenticated
   */
  isAdminAuthenticated(): boolean {
    return !!apiService.getAuthToken() && !!sessionStorage.getItem('adminAuth');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiService.getAuthToken();
  }

  /**
   * Get current admin user
   */
  getAdminUser(): any | null {
    const userStr = sessionStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get current user
   */
  getUser(): any | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Extract token expiration from JWT token
   * Returns expiration time in seconds, or undefined if not available
   */
  private getTokenExpiration(token: string): number | undefined {
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return undefined;

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if exp claim exists
      if (payload.exp) {
        // exp is in seconds, convert to milliseconds for consistency
        const now = Math.floor(Date.now() / 1000);
        return payload.exp - now; // Return seconds until expiration
      }
    } catch (error) {
      console.warn('Failed to parse token expiration:', error);
    }
    return undefined;
  }
}

// Export singleton instance
export const authService = new AuthService();
