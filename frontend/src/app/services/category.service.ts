import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CategoryDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAll(): Promise<CategoryDto[]> {
    return firstValueFrom(this.http.get<CategoryDto[]>(`${API_BASE_URL}/categories`));
  }

  getById(id: number): Promise<CategoryDto> {
    return firstValueFrom(this.http.get<CategoryDto>(`${API_BASE_URL}/categories/${id}`));
  }

  create(dto: { name: string }): Promise<CategoryDto> {
    return firstValueFrom(this.http.post<CategoryDto>(`${API_BASE_URL}/categories`, dto));
  }

  update(id: number, dto: { name: string }): Promise<CategoryDto> {
    return firstValueFrom(this.http.put<CategoryDto>(`${API_BASE_URL}/categories/${id}`, dto));
  }

  delete(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${API_BASE_URL}/categories/${id}`));
  }
}
