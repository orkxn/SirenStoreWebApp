import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7009/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getMyProducts(): Observable<Product[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Product[]>(`${this.apiUrl}/my-products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createProduct(product: Partial<Product>): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(this.apiUrl, product, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateProduct(product: Partial<Product>): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(this.apiUrl, product, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
