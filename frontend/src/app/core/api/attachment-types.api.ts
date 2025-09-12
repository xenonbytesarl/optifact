import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {GlobalHttpApi} from './global-http-repository.service';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../model/response.model';
import {Direction} from '../model/direction.enum';

export interface AttachmentType {
  id: string;
  name: string;
}

export type AttachmentTypeSortColumn = 'name';

@Injectable({providedIn: 'root'})
export class AttachmentTypesApi extends GlobalHttpApi {
  private base = this.apiUrl + '/attachment-types';

  async search(nameFilter: string, page: number, size: number, direction: Direction, sort: AttachmentTypeSortColumn) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction.valueOf());

    if (nameFilter) params = params.set('nameFilter', nameFilter);
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Page<AttachmentType> | ErrorApiResponse>>(this.base, {params}));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async get(id: string) {
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<AttachmentType | ErrorApiResponse>>(`${this.base}/${id}`));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async create(payload: Partial<AttachmentType>) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<AttachmentType | ErrorApiResponse>>(this.base, payload));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<AttachmentType>) {
    try {
      return await firstValueFrom(this.http.put<SuccessApiResponse<AttachmentType | ErrorApiResponse>>(`${this.base}/${id}`, payload));
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

  async findByIds(ids: string[]) {
    try {
      let params = new HttpParams();
      ids.forEach(id => params = params.append('ids', id));
      return await firstValueFrom(this.http.get<SuccessApiResponse<AttachmentType[] | ErrorApiResponse>>(`${this.base}/find-by-ids`, { params }));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }
}
