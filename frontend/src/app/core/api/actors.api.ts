import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Actor } from '../../features/actors/models';

@Injectable({ providedIn: 'root' })
export class ActorsApi {
  private http = inject(HttpClient);
  private base = '/api/actors';

  list() { return firstValueFrom(this.http.get<Actor[]>(this.base)); }
  get(id: string) { return firstValueFrom(this.http.get<Actor>(`${this.base}/${id}`)); }
  create(payload: Partial<Actor>) { return firstValueFrom(this.http.post<Actor>(this.base, payload)); }
  update(id: string, payload: Partial<Actor>) { return firstValueFrom(this.http.put<Actor>(`${this.base}/${id}`, payload)); }
  remove(id: string) { return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`)); }
}
