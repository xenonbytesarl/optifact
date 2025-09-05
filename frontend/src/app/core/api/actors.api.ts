import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actor } from '../../features/actors/models';

@Injectable({ providedIn: 'root' })
export class ActorsApi {
  private http = inject(HttpClient);
  private base = '/api/actors';

  list() { return this.http.get<Actor[]>(this.base).toPromise(); }
  get(id: string) { return this.http.get<Actor>(`${this.base}/${id}`).toPromise(); }
  create(payload: Partial<Actor>) { return this.http.post<Actor>(this.base, payload).toPromise(); }
  update(id: string, payload: Partial<Actor>) { return this.http.put<Actor>(`${this.base}/${id}`, payload).toPromise(); }
  remove(id: string) { return this.http.delete<void>(`${this.base}/${id}`).toPromise(); }
}
