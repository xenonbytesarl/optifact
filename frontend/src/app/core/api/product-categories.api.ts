import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {GlobalHttpRepository} from './global-http-repository.service';
import {ErrorApiResponse, SuccessApiResponse} from '../model/response.model';

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Page<T> {
  elements: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductCategoriesApi extends GlobalHttpRepository {
  private base = this.apiUrl + '/product-categories';

  list() { return firstValueFrom(this.http.get<SuccessApiResponse<Page<ProductCategory> | ErrorApiResponse>>(this.base)); }
  get(id: string) { return firstValueFrom(this.http.get<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(`${this.base}/${id}`)); }
  create(payload: Partial<ProductCategory>) { return firstValueFrom(this.http.post<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(this.base, payload)); }
  update(id: string, payload: Partial<ProductCategory>) { return firstValueFrom(this.http.put<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(`${this.base}/${id}`, payload)); }
  remove(id: string) { return firstValueFrom(this.http.delete<SuccessApiResponse<void | ErrorApiResponse>>(`${this.base}/${id}`)); }
}
