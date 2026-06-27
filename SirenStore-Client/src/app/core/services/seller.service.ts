import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface SellerPublicProfile {
  id: number;
  storeName: string;
  storeLogoUrl: string;
  ownerFullName: string;
  contactLine: string;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'https://localhost:7009/api/sellers';

  constructor(private http: HttpClient) {}

  getSellerProfile(id: number): Observable<SellerPublicProfile> {
    return this.http.get<SellerPublicProfile>(`${this.apiUrl}/${id}/profile`);
  }

  applyToBecomeSeller(dto: { storeName: string, contactEmail: string, contactPhone: string, supportLine: string, taxNumber: string, taxOffice: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/apply`, dto);
  }

  getMySellerStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-status`);
  }
}
