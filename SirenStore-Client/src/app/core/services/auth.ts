import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, TokenResponse, RegisterRequest, DecodedUser, UserTypes } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7009/api/auth';

  // Reaktif auth state
  private currentUser = signal<DecodedUser | null>(this.loadUserFromToken());

  user = computed(() => this.currentUser());

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  // Login — Backend TokenDto(AccessToken, Expiration, RefreshToken) dönüyor
  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        // JWT token'ın içinden kullanıcı bilgisini çöz
        const decoded = this.decodeToken(response.accessToken);
        if (decoded) {
          localStorage.setItem('user', JSON.stringify(decoded));
          this.currentUser.set(decoded);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getCurrentUser(): DecodedUser | null {
    return this.currentUser();
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // JWT token'ın payload kısmını decode et
  private decodeToken(token: string): DecodedUser | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      // Backend claim isimleri:
      // ClaimTypes.NameIdentifier -> "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      // ClaimTypes.Email -> "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      // ClaimTypes.Role -> "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      // "FirstName" -> "FirstName"
      // "LastName" -> "LastName"
      const nameIdKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
      const emailKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
      const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

      const roleStr = decoded[roleKey] || '';
      let userType = UserTypes.Customer;
      if (roleStr === 'Seller') userType = UserTypes.Seller;
      else if (roleStr === 'Admin') userType = UserTypes.Admin;

      return {
        id: parseInt(decoded[nameIdKey], 10),
        email: decoded[emailKey] || '',
        firstName: decoded['FirstName'] || '',
        lastName: decoded['LastName'] || '',
        userType
      };
    } catch {
      return null;
    }
  }

  private loadUserFromToken(): DecodedUser | null {
    // Önce cached user'ı dene
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try { return JSON.parse(userJson); } catch { /* ignore */ }
    }
    // Yoksa token'dan decode et
    const token = localStorage.getItem('token');
    if (token) {
      return this.decodeToken(token);
    }
    return null;
  }
}