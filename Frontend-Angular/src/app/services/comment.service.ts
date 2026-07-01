import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommentDto, CommentCreateDto, CommentUpdateDto } from '../models/api.types';
import { API_BASE_URL } from '../interceptors/api.interceptor';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  getByProductId(productId: number): Promise<CommentDto[]> {
    return firstValueFrom(this.http.get<CommentDto[]>(`${API_BASE_URL}/comments/product/${productId}`));
  }

  getMyComments(): Promise<CommentDto[]> {
    return firstValueFrom(this.http.get<CommentDto[]>(`${API_BASE_URL}/comments/my-comments`));
  }

  checkEligibility(productId: number): Promise<{ isEligible: boolean }> {
    return firstValueFrom(this.http.get<{ isEligible: boolean }>(`${API_BASE_URL}/comments/eligibility/${productId}`));
  }

  create(dto: CommentCreateDto): Promise<CommentDto> {
    return firstValueFrom(this.http.post<CommentDto>(`${API_BASE_URL}/comments`, dto));
  }

  update(id: number, dto: CommentUpdateDto): Promise<CommentDto> {
    return firstValueFrom(this.http.put<CommentDto>(`${API_BASE_URL}/comments/${id}`, dto));
  }

  delete(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${API_BASE_URL}/comments/${id}`));
  }
}
