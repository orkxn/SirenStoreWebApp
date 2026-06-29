import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserProfileDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) {}

  getProfile(): Promise<UserProfileDto> {
    return firstValueFrom(this.http.get<UserProfileDto>(`${API_BASE_URL}/customer/profile`));
  }

  updateProfile(dto: { firstName: string; lastName: string; phoneNumber: string | null }): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/customer/profile/update`, dto));
  }

  changePassword(dto: any): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/customer/change-password`, dto));
  }
}
