import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7009/api/auth'; 

  constructor(private http: HttpClient) { }

  // 1. Giriş Yapma (Login) Metodu
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        // Giriş başarılı olunca tokenları ve kullanıcı bilgisini tarayıcı hafızasına alıyoruz
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  // 2. Çıkış Yapma (Logout) Metodu
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // 3. O an giriş yapmış kullanıcıyı hafızadan çekme
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // 4. Kullanıcı giriş yapmış mı kontrolü
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }
}