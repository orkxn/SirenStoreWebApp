import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { customerService } from '../services/customerService';
import { TokenDto, UserProfileDto, UserTypes } from '../types/api.types';

interface AuthUser {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfileDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: any) => Promise<void>;
  register: (dto: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserFromToken = (token: string) => {
    const decoded = parseJwt(token);
    if (decoded) {
      // Decode standard claims:
      // NameIdentifier is typically: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      // Role is typically: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      // Email is typically: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      const claimId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.nameid || decoded.sub;
      const claimRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
      const claimEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email;
      const claimFirstName = decoded.FirstName || decoded.given_name || "";
      const claimLastName = decoded.LastName || decoded.family_name || "";

      setUser({
        id: claimId ? parseInt(claimId, 10) : 0,
        email: claimEmail || "",
        role: claimRole || "Customer",
        firstName: claimFirstName,
        lastName: claimLastName,
      });
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await customerService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile info', err);
    }
  };

  const refreshProfile = async () => {
    if (localStorage.getItem('accessToken')) {
      await fetchProfile();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        loadUserFromToken(token);
        await fetchProfile();
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen to global logout events triggered by apiClient interceptor on 401 expiration
    const handleGlobalLogout = () => {
      setUser(null);
      setProfile(null);
    };

    window.addEventListener('auth-logout', handleGlobalLogout);
    return () => window.removeEventListener('auth-logout', handleGlobalLogout);
  }, []);

  const login = async (dto: any) => {
    const result: TokenDto = await authService.login(dto);
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    loadUserFromToken(result.accessToken);
    await fetchProfile();
  };

  const register = async (dto: any) => {
    await authService.register(dto);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
