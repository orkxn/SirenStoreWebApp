import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductListDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(): Promise<ProductListDto[]> {
    return firstValueFrom(this.http.get<ProductListDto[]>(`${API_BASE_URL}/products`));
  }

  getAllTags(): Promise<string[]> {
    return firstValueFrom(this.http.get<string[]>(`${API_BASE_URL}/products/tags`));
  }

  getById(id: number): Promise<ProductListDto> {
    return firstValueFrom(this.http.get<ProductListDto>(`${API_BASE_URL}/products/${id}`));
  }

  getByCategoryId(categoryId: number): Promise<ProductListDto[]> {
    return firstValueFrom(this.http.get<ProductListDto[]>(`${API_BASE_URL}/products/category/${categoryId}`));
  }

  getMyProducts(): Promise<ProductListDto[]> {
    return firstValueFrom(this.http.get<ProductListDto[]>(`${API_BASE_URL}/products/my-products`));
  }

  create(dto: { name: string; description: string; price: number; stock: number; categoryId: number; imageUrls: string[]; tags?: string[] }): Promise<any> {
    return firstValueFrom(this.http.post(`${API_BASE_URL}/products`, dto));
  }

  update(dto: { id: number; name: string; description: string; price: number; stock: number; categoryId: number; imageUrls: string[]; tags?: string[] }): Promise<any> {
    return firstValueFrom(this.http.put(`${API_BASE_URL}/products`, dto));
  }

  delete(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${API_BASE_URL}/products/${id}`));
  }
}
