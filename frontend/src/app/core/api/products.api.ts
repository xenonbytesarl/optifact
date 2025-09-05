import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type ProductType = 'forfait' | 'pourcentage';

export interface Product {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  amount?: number | null; // montant (forfait)
  rate?: number | null;   // taux (pourcentage)
  categoryId?: string | null;
  description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private http = inject(HttpClient);
  private base = '/api/products';

  list() { return firstValueFrom(this.http.get<Product[]>(this.base)); }
  get(id: string) { return firstValueFrom(this.http.get<Product>(`${this.base}/${id}`)); }
  create(payload: Partial<Product>) { return firstValueFrom(this.http.post<Product>(this.base, payload)); }
  update(id: string, payload: Partial<Product>) { return firstValueFrom(this.http.put<Product>(`${this.base}/${id}`, payload)); }
  remove(id: string) { return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`)); }
}
