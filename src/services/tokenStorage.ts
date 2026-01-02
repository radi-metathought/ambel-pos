/**
 * Secure Token Storage Service
 * 
 * This service provides secure token storage using multiple strategies:
 * 1. Memory storage (most secure, lost on refresh)
 * 2. SessionStorage (secure, lost on tab close)
 * 3. Encrypted localStorage (fallback, less secure but persistent)
 * 
 * Best practice: Backend should use httpOnly cookies for tokens
 */

interface TokenData {
  token: string;
  expiresAt?: number;
  refreshToken?: string;
}

class SecureTokenStorage {
  // In-memory storage (most secure, but lost on page refresh)
  private memoryStorage: Map<string, TokenData> = new Map();
  
  // Encryption key (in production, this should be more sophisticated)
  private readonly ENCRYPTION_KEY = 'your-app-secret-key';

  /**
   * Simple encryption (XOR cipher)
   * Note: This is basic encryption. For production, consider using Web Crypto API
   */
  private encrypt(text: string): string {
    try {
      const encrypted = btoa(
        text.split('').map((char, i) => 
          String.fromCharCode(
            char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length)
          )
        ).join('')
      );
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      return text;
    }
  }

  /**
   * Simple decryption
   */
  private decrypt(encrypted: string): string {
    try {
      const decrypted = atob(encrypted)
        .split('')
        .map((char, i) => 
          String.fromCharCode(
            char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length)
          )
        )
        .join('');
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encrypted;
    }
  }

  /**
   * Store token securely
   * Priority: Memory > SessionStorage > Encrypted localStorage
   */
  setToken(key: string, token: string, expiresIn?: number): void {
    const tokenData: TokenData = {
      token,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
    };

    // 1. Store in memory (most secure)
    this.memoryStorage.set(key, tokenData);

    // 2. Store in sessionStorage (secure, lost on tab close)
    try {
      sessionStorage.setItem(key, this.encrypt(JSON.stringify(tokenData)));
    } catch (error) {
      console.warn('SessionStorage not available:', error);
    }

    // 3. Fallback: Encrypted localStorage (less secure but persistent)
    // Only use if user opts in for "Remember Me"
    // We'll handle this separately
  }

  /**
   * Get token from storage
   * Priority: Memory > SessionStorage > Encrypted localStorage
   */
  getToken(key: string): string | null {
    // 1. Try memory first
    const memoryToken = this.memoryStorage.get(key);
    if (memoryToken && this.isTokenValid(memoryToken)) {
      return memoryToken.token;
    }

    // 2. Try sessionStorage
    try {
      const sessionData = sessionStorage.getItem(key);
      if (sessionData) {
        const decrypted = this.decrypt(sessionData);
        const tokenData: TokenData = JSON.parse(decrypted);
        
        if (this.isTokenValid(tokenData)) {
          // Restore to memory
          this.memoryStorage.set(key, tokenData);
          return tokenData.token;
        } else {
          // Token expired, remove it
          this.removeToken(key);
        }
      }
    } catch (error) {
      console.warn('Failed to get token from sessionStorage:', error);
    }

    // 3. Try encrypted localStorage (if "Remember Me" was used)
    try {
      const localData = localStorage.getItem(`encrypted_${key}`);
      if (localData) {
        const decrypted = this.decrypt(localData);
        const tokenData: TokenData = JSON.parse(decrypted);
        
        if (this.isTokenValid(tokenData)) {
          // Restore to memory and session
          this.memoryStorage.set(key, tokenData);
          sessionStorage.setItem(key, this.encrypt(JSON.stringify(tokenData)));
          return tokenData.token;
        } else {
          this.removeToken(key);
        }
      }
    } catch (error) {
      console.warn('Failed to get token from localStorage:', error);
    }

    return null;
  }

  /**
   * Store token persistently (for "Remember Me" feature)
   * Uses encrypted localStorage
   */
  setTokenPersistent(key: string, token: string, expiresIn?: number): void {
    const tokenData: TokenData = {
      token,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
    };

    // Store in all locations
    this.memoryStorage.set(key, tokenData);
    
    try {
      const encrypted = this.encrypt(JSON.stringify(tokenData));
      sessionStorage.setItem(key, encrypted);
      localStorage.setItem(`encrypted_${key}`, encrypted);
    } catch (error) {
      console.error('Failed to store token persistently:', error);
    }
  }

  /**
   * Remove token from all storage locations
   */
  removeToken(key: string): void {
    // Remove from memory
    this.memoryStorage.delete(key);

    // Remove from sessionStorage
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
    }

    // Remove from localStorage
    try {
      localStorage.removeItem(`encrypted_${key}`);
      // Also remove old unencrypted tokens (migration)
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Check if token is still valid
   */
  private isTokenValid(tokenData: TokenData): boolean {
    if (!tokenData.expiresAt) {
      return true; // No expiration set
    }
    return Date.now() < tokenData.expiresAt;
  }

  /**
   * Clear all tokens
   */
  clearAll(): void {
    // Clear memory
    this.memoryStorage.clear();

    // Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
    }

    // Clear localStorage tokens
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('encrypted_') || key.includes('Token') || key.includes('Auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Check if token exists
   */
  hasToken(key: string): boolean {
    return this.getToken(key) !== null;
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(key: string): number | null {
    const tokenData = this.memoryStorage.get(key);
    return tokenData?.expiresAt || null;
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  isTokenExpiringSoon(key: string): boolean {
    const expiresAt = this.getTokenExpiration(key);
    if (!expiresAt) return false;
    
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() + fiveMinutes > expiresAt;
  }
}

// Export singleton instance
export const secureTokenStorage = new SecureTokenStorage();

// Export types
export type { TokenData };
