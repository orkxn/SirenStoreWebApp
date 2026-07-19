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
  // ponytail: 30-second client cache for product queries to prevent duplicate API hits on back/forward navigation. Upgrade to HTTP interceptor or state store if global cache policies are required.
  private cache = new Map<string, { data: PagedResult<ProductListDto>; expiry: number }>();
  private readonly CACHE_TTL_MS = 30000;

  constructor(private http: HttpClient) {}

  clearCache(): void {
    this.cache.clear();
  }

  async getAll(query: ProductQueryParams = {}): Promise<PagedResult<ProductListDto>> {
    let params = new HttpParams();
    if (query.page) params = params.set('page', query.page);
    if (query.pageSize) params = params.set('pageSize', query.pageSize);
    if (query.categoryId) params = params.set('categoryId', query.categoryId);
    if (query.search) params = params.set('search', query.search);
    if (query.minPrice != null && query.minPrice !== '') params = params.set('minPrice', String(query.minPrice));
    if (query.maxPrice != null && query.maxPrice !== '') params = params.set('maxPrice', String(query.maxPrice));
    if (query.onlyInStock) params = params.set('onlyInStock', true);
    if (query.sortBy && query.sortBy !== 'default') params = params.set('sortBy', query.sortBy);

    const cacheKey = params.toString();
    const now = Date.now();
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiry > now) {
      return cached.data;
    }

    const data = await firstValueFrom(this.http.get<PagedResult<ProductListDto>>(`${API_BASE_URL}/products`, { params }));
    this.cache.set(cacheKey, { data, expiry: now + this.CACHE_TTL_MS });
    return data;
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

  async create(dto: { name: string; description: string; price: number; stock: number; categoryId: number; imageUrls: string[]; tags?: string[] }): Promise<any> {
    const res = await firstValueFrom(this.http.post(`${API_BASE_URL}/products`, dto));
    this.clearCache();
    return res;
  }

  async update(dto: { id: number; name: string; description: string; price: number; stock: number; categoryId: number; imageUrls: string[]; tags?: string[] }): Promise<any> {
    const res = await firstValueFrom(this.http.put(`${API_BASE_URL}/products`, dto));
    this.clearCache();
    return res;
  }

  async delete(id: number): Promise<any> {
    const res = await firstValueFrom(this.http.delete(`${API_BASE_URL}/products/${id}`));
    this.clearCache();
    return res;
  }
}
