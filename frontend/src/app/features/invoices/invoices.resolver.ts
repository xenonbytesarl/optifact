import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { invoiceStore } from './invoice.store';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../core/constant/constant';
import { Direction } from '../../core/model/direction.enum';

export const invoiceSearchResolver: ResolveFn<boolean> = async () => {
  const store = inject(invoiceStore);
  try {
    await store.search('', '', '', '', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, Direction.DESC, 'createdAt');
    return true;
  } catch {
    return false;
  }
};

export const invoiceFindByIdResolver: ResolveFn<boolean> = async (route) => {
  const store = inject(invoiceStore);
  try {
    await store.findById(route.paramMap.get('id') ?? '');
    return true;
  } catch {
    return false;
  }
};
