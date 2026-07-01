import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TokenDto, UserProfileDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  private profileSubject = new BehaviorSubject<UserProfileDto | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  user$ = this.userSubject.asObservable();
  profile$ = this.profileSubject.asObservable();
  isLoading$ = this.loadingSubject.asObservable();

  get user(): AuthUser | null { return this.userSubject.value; }
  get profile(): UserProfileDto | null { return this.profileSubject.value; }
  get isAuthenticated(): boolean { return !!this.userSubject.value; }
  get isLoading(): boolean { return this.loadingSubject.value; }

  constructor(private http: HttpClient) {
    this.initializeAuth();
    window.addEventListener('auth-logout', () => {
      this.userSubject.next(null);
      this.profileSubject.next(null);
    });
  }

  private async initializeAuth() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.loadUserFromToken(token);
      await this.fetchProfile();
    }
    this.loadingSubject.next(false);
  }

  private loadUserFromToken(token: string) {
    const decoded = this.parseJwt(token);
    if (decoded) {
      const claimId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid || decoded.sub;
      const claimRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role;
      const claimEmail = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email;
      const claimFirstName = decoded.FirstName || decoded.given_name || '';
      const claimLastName = decoded.LastName || decoded.family_name || '';

      this.userSubject.next({
        id: claimId ? parseInt(claimId, 10) : 0,
        email: claimEmail || '',
        role: claimRole || 'Customer',
        firstName: claimFirstName,
        lastName: claimLastName,
      });
    }
  }

  private async fetchProfile() {
    try {
      const data = await firstValueFrom(this.http.get<UserProfileDto>(`${API_BASE_URL}/customer/profile`));
      this.profileSubject.next(data);
    } catch (err) {
      console.error('Failed to fetch profile info', err);
    }
  }

  async refreshProfile() {
    if (localStorage.getItem('accessToken')) {
      await this.fetchProfile();
    }
  }

  async login(dto: any): Promise<void> {
    const result = await firstValueFrom(this.http.post<TokenDto>(`${API_BASE_URL}/auth/login`, dto));
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    this.loadUserFromToken(result.accessToken);
    await this.fetchProfile();
  }

  async register(dto: any): Promise<void> {
    await firstValueFrom(this.http.post(`${API_BASE_URL}/auth/register`, dto));
  }

  async verifyEmail(dto: { email: string, token: string }): Promise<void> {
    const result = await firstValueFrom(this.http.post<TokenDto>(`${API_BASE_URL}/auth/verify-email`, dto));
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    this.loadUserFromToken(result.accessToken);
    await this.fetchProfile();
  }

  async resendVerificationEmail(dto: { email: string }): Promise<void> {
    await firstValueFrom(this.http.post(`${API_BASE_URL}/auth/resend-verification-email`, dto));
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.userSubject.next(null);
    this.profileSubject.next(null);
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
