import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ProductCategory {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProductCategoriesApi {
  private http = inject(HttpClient);
  private base = '/api/product-categories';

  list() { return firstValueFrom(this.http.get<ProductCategory[]>(this.base)); }
  get(id: string) { return firstValueFrom(this.http.get<ProductCategory>(`${this.base}/${id}`)); }
  create(payload: Partial<ProductCategory>) { return firstValueFrom(this.http.post<ProductCategory>(this.base, payload)); }
  update(id: string, payload: Partial<ProductCategory>) { return firstValueFrom(this.http.put<ProductCategory>(`${this.base}/${id}`, payload)); }
  remove(id: string) { return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`)); }
}
