import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {GlobalHttpRepository} from './global-http-repository.service';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../model/response.model';
import {Direction} from '../model/direction.enum';

export interface ProductCategory {
  id: string;
  name: string;
}

export type ProductCategorySortColumn = 'name';

@Injectable({providedIn: 'root'})
export class ProductCategoriesApi extends GlobalHttpRepository {
  private base = this.apiUrl + '/product-categories';

  async search(nameFilter: string, page: number, size: number, direction: Direction, sort: ProductCategorySortColumn) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction.valueOf());

    if (nameFilter) params = params.set('nameFilter', nameFilter);
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Page<ProductCategory> | ErrorApiResponse>>(this.base, {params}));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async get(id: string) {
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(`${this.base}/${id}`));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async create(payload: Partial<ProductCategory>) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(this.base, payload));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<ProductCategory>) {
    try {
      return await firstValueFrom(this.http.put<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(`${this.base}/${id}`, payload));
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
