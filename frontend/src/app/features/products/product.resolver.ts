import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {Direction} from '../../core/model/direction.enum';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {productStore} from './products.store';


export const productSearchResolver: ResolveFn<boolean> = async (route, state) => {
  const store = inject(productStore);
  try {
    await store.search('', '','', '', '', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, Direction.ASC, 'name')
    return true;
  } catch {
    return false;
  }
};

export const productFindByIdResolver:  ResolveFn<boolean> = async (route, state) => {
  const store = inject(productStore);
  try {
    await store.findById(route.paramMap.get('id') ?? '');
    return true;
  } catch {
    return false;
  }
}
