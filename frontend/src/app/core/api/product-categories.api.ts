import { Injectable } from '@angular/core';
import {HttpParams} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {GlobalHttpRepository} from './global-http-repository.service';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../model/response.model';
import {Direction} from '../model/direction.enum';

export interface ProductCategory {
  id: string;
  name: string;
}

export type ProductCategorySortColumn = 'name';

@Injectable({ providedIn: 'root' })
export class ProductCategoriesApi extends GlobalHttpRepository {
  private base = this.apiUrl + '/product-categories';

  search(nameFilter: string, page: number, size: number, direction: Direction, sort: ProductCategorySortColumn ) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction.valueOf());

    if(nameFilter) params = params.set('nameFilter', nameFilter);
    return firstValueFrom(this.http.get<SuccessApiResponse<Page<ProductCategory> | ErrorApiResponse>>(this.base, {params}));
  }
  get(id: string) { return firstValueFrom(this.http.get<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(`${this.base}/${id}`)); }
  create(payload: Partial<ProductCategory>) { return firstValueFrom(this.http.post<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(this.base, payload)); }
  update(id: string, payload: Partial<ProductCategory>) { return firstValueFrom(this.http.put<SuccessApiResponse<ProductCategory | ErrorApiResponse>>(`${this.base}/${id}`, payload)); }
  remove(id: string) { return firstValueFrom(this.http.delete<SuccessApiResponse<void | ErrorApiResponse>>(`${this.base}/${id}`)); }
}
