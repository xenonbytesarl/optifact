import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {GlobalHttpApi} from './global-http-repository.service';
import {Direction} from '../model/direction.enum';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../model/response.model';

export type ProductType = 'FLAT_AMOUNT' | 'PERCENTAGE';

export interface Product {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  amount?: number | null; // montant (forfait)
  rate?: number | null;   // taux (pourcentage)
  categoryId?: string | null;
  sequenceId?: string | null;
  description?: string | null;
  currency?: string | null;
  attachmentTypeIds?: string[] | null;
}

export type ProductSortColumn = 'name' | 'reference';

@Injectable({providedIn: 'root'})
export class ProductsApi extends GlobalHttpApi {

  private base = this.apiUrl + '/products';

  async search(nameFilter: string, codeFilter: string, typeFilter: string, categoryNameFilter: string, page: number, size: number, direction: Direction, sort: ProductSortColumn) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction.valueOf());

    if (nameFilter) params = params.set('nameFilter', nameFilter);
    if (codeFilter) params = params.set('codeFilter', nameFilter);
    if (typeFilter) params = params.set('typeFilter', nameFilter);
    if (categoryNameFilter) params = params.set('categoryNameFilter', nameFilter);
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Page<Product> | ErrorApiResponse>>(this.base, {params}));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async get(id: string) {
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Product | ErrorApiResponse>>(`${this.base}/${id}`));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async create(payload: Partial<Product>) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<Product | ErrorApiResponse>>(this.base, payload));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<Product>) {
    try {
      return await firstValueFrom(this.http.put<SuccessApiResponse<Product | ErrorApiResponse>>(`${this.base}/${id}`, payload));
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
