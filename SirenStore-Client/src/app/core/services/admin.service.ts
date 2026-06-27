import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserManagementDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: number; // UserTypes: Customer=0, Seller=1, Admin=2
  isDeleted: boolean; // true = banned
}

export interface SellerManagementDto {
  id: number;
  userId: number;
  userEmail: string;
  storeName: string;
  taxNumber: string;
  taxOffice: string;
  contactEmail: string;
  contactPhone: string;
  supportLine: string;
  status: number; // SellerStatus: Pending=1, Approved=2, Rejected=3
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiAdminUrl = 'https://localhost:7009/api/admin';
  private apiSellersUrl = 'https://localhost:7009/api/sellers';

  private http = inject(HttpClient);

  getUsers(): Observable<UserManagementDto[]> {
    return this.http.get<UserManagementDto[]>(`${this.apiAdminUrl}/users`);
  }

  getSellers(): Observable<SellerManagementDto[]> {
    return this.http.get<SellerManagementDto[]>(`${this.apiAdminUrl}/sellers`);
  }

  banUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiAdminUrl}/users/${userId}/ban`, {});
  }

  unbanUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiAdminUrl}/users/${userId}/unban`, {});
  }

  approveSeller(sellerId: number): Observable<any> {
    return this.http.post(`${this.apiSellersUrl}/approve/${sellerId}`, {});
  }

  rejectSeller(sellerId: number): Observable<any> {
    return this.http.post(`${this.apiSellersUrl}/reject/${sellerId}`, {});
  }
}
