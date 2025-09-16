import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {Actor, ActorSortColumn} from './models';
import {Direction} from '../../model/direction.enum';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../../model/response.model';
import {GlobalApi} from '../global.api';

@Injectable({ providedIn: 'root' })
export class ActorsApi extends GlobalApi {
  private base = this.apiUrl + '/actors';

  async search(nameFilter: string, referenceFilter: string, page: number, size: number, direction: Direction, sort: ActorSortColumn) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction.valueOf());

    if (nameFilter) params = params.set('nameFilter', nameFilter);
    if (referenceFilter) params = params.set('referenceFilter', nameFilter);
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Page<Actor> | ErrorApiResponse>>(this.base, {params}));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async get(id: string) {
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Actor | ErrorApiResponse>>(`${this.base}/${id}`));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async create(payload: Partial<Actor>) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<Actor | ErrorApiResponse>>(this.base, payload));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<Actor>) {
    try {
      return await firstValueFrom(this.http.put<SuccessApiResponse<Actor | ErrorApiResponse>>(`${this.base}/${id}`, payload));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await firstValueFrom(this.http.delete<SuccessApiResponse<void | ErrorApiResponse>>(`${this.base}/${id}`));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }
}
