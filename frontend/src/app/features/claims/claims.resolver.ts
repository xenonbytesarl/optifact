import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { claimStore } from './claim.store';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {Direction} from '../../core/model/direction.enum';

// Preload the first page of claims before entering the list route
export const claimSearchResolver: ResolveFn<boolean> = async () => {
  const store = inject(claimStore);
  try {
    await store.search('', '', '', '', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, Direction.DESC, 'createdAt');
    return true;
  } catch {
    return false;
  }
};

export const claimFindByIdResolver: ResolveFn<boolean> = async (route, state) => {
  const store = inject(claimStore);
  try {
    await store.findById(route.paramMap.get('id') ?? '');
    return true;
  } catch {
    return false;
  }
}
