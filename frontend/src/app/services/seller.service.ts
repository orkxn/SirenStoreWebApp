import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SellerPublicProfileDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class SellerService {
  constructor(private http: HttpClient) {}

  getSellerProfile(id: number): Promise<SellerPublicProfileDto> {
    return firstValueFrom(this.http.get<SellerPublicProfileDto>(`${API_BASE_URL}/sellers/${id}/profile`));
  }

  becomeSeller(dto: { storeName: string; contactEmail: string; contactPhone: string; supportLine: string; taxNumber: string; taxOffice: string }): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/sellers/apply`, dto));
  }

  getMyStatus(): Promise<{ id?: number; hasApplied: boolean; status: string; storeName?: string; contactEmail?: string; contactPhone?: string; supportLine?: string; taxNumber?: string; taxOffice?: string }> {
    return firstValueFrom(this.http.get<any>(`${API_BASE_URL}/sellers/my-status`));
  }

  approveSeller(sellerId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/sellers/approve/${sellerId}`, null));
  }

  rejectSeller(sellerId: number): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/sellers/reject/${sellerId}`, null));
  }
}
