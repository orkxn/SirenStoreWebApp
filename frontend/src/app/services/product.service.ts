import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductListDto, PagedResult } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  categoryId?: number | null;
  search?: string;
  minPrice?: number | '' | null;
  maxPrice?: number | '' | null;
  onlyInStock?: boolean;
  sortBy?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(query: ProductQueryParams = {}): Promise<PagedResult<ProductListDto>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);
    if (query.categoryId) params = params.set('categoryId', query.categoryId);
    if (query.search) params = params.set('search', query.search);
    if (query.minPrice != null && query.minPrice !== '') params = params.set('minPrice', String(query.minPrice));
    if (query.maxPrice != null && query.maxPrice !== '') params = params.set('maxPrice', String(query.maxPrice));
    if (query.onlyInStock) params = params.set('onlyInStock', true);
    if (query.sortBy && query.sortBy !== 'default') params = params.set('sortBy', query.sortBy);
    return firstValueFrom(this.http.get<PagedResult<ProductListDto>>(`${API_BASE_URL}/products`, { params }));
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
