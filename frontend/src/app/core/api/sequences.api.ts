import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {GlobalHttpApi} from './global-http-repository.service';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../model/response.model';
import {Direction} from '../model/direction.enum';

export interface Sequence {
  id: string;
  code: string;
  name: string;
  step: number;
  size: number;
  next: number; // the backend exposes it next as string
  prefix?: string | null;
  suffix?: string | null;
  active: boolean;
}

export type SequenceSortColumn = 'name' | 'code' | 'prefix' | 'suffix';

@Injectable({providedIn: 'root'})
export class SequencesApi extends GlobalHttpApi {
  private base = this.apiUrl + '/sequences';

  async search(
    nameFilter: string,
    codeFilter: string,
    prefixFilter: string,
    suffixFilter: string,
    page: number,
    size: number,
    direction: Direction,
    sort: SequenceSortColumn
  ) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction.valueOf());

    if (nameFilter) params = params.set('nameFilter', nameFilter);
    if (codeFilter) params = params.set('codeFilter', codeFilter);
    if (prefixFilter) params = params.set('prefixFilter', prefixFilter);
    if (suffixFilter) params = params.set('suffixFilter', suffixFilter);

    try {
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<Page<Sequence> | ErrorApiResponse>>(this.base, {params})
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async get(id: string) {
    try {
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<Sequence | ErrorApiResponse>>(`${this.base}/${id}`)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async findByCode(code: string) {
    try {
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<Sequence | ErrorApiResponse>>(`${this.base}/code/${code}`)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async create(payload: Partial<Sequence>) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<Sequence | ErrorApiResponse>>(this.base, payload)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<Sequence>) {
    try {
      return await firstValueFrom(
        this.http.put<SuccessApiResponse<Sequence | ErrorApiResponse>>(`${this.base}/${id}`, payload)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await firstValueFrom(
        this.http.delete<SuccessApiResponse<void | ErrorApiResponse>>(`${this.base}/${id}`)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }
}
