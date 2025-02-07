import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/products';

  getProducts(): Observable<Product[]> {
    // Removed limit and skip as the API doesn't support pagination
    return this.http.get<Product[]>(this.apiUrl);
  }
}