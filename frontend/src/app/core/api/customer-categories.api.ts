import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CustomerCategory {
  id: string;
  name: string;
  description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CustomerCategoriesApi {
  private http = inject(HttpClient);
  private base = '/api/customer-categories';

  list() { return this.http.get<CustomerCategory[]>(this.base).toPromise(); }
  get(id: string) { return this.http.get<CustomerCategory>(`${this.base}/${id}`).toPromise(); }
  create(payload: Partial<CustomerCategory>) { return this.http.post<CustomerCategory>(this.base, payload).toPromise(); }
  update(id: string, payload: Partial<CustomerCategory>) { return this.http.put<CustomerCategory>(`${this.base}/${id}`, payload).toPromise(); }
  remove(id: string) { return this.http.delete<void>(`${this.base}/${id}`).toPromise(); }
}
