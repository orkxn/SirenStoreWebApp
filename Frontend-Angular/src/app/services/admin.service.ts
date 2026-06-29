import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SellerManagementDto, UserManagementDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Promise<UserManagementDto[]> {
    return firstValueFrom(this.http.get<UserManagementDto[]>(`${API_BASE_URL}/admin/users`));
  }

  getAllSellers(): Promise<SellerManagementDto[]> {
    return firstValueFrom(this.http.get<SellerManagementDto[]>(`${API_BASE_URL}/admin/sellers`));
  }

  banUser(id: number): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/admin/users/${id}/ban`, null));
  }

  unbanUser(id: number): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/admin/users/${id}/unban`, null));
  }
}
