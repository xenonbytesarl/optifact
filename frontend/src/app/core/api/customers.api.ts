import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../features/customers/models';

@Injectable({ providedIn: 'root' })
export class CustomersApi {
  private http = inject(HttpClient);
  private base = '/api/customers';

  list() { return this.http.get<Customer[]>(this.base).toPromise(); }
  get(id: string) { return this.http.get<Customer>(`${this.base}/${id}`).toPromise(); }
  create(payload: Partial<Customer>) { return this.http.post<Customer>(this.base, payload).toPromise(); }
  update(id: string, payload: Partial<Customer>) { return this.http.put<Customer>(`${this.base}/${id}`, payload).toPromise(); }
  remove(id: string) { return this.http.delete<void>(`${this.base}/${id}`).toPromise(); }
}
