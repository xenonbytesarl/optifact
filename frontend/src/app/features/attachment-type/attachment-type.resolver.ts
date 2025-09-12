import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {attachmentTypeStore} from './attachment-type.store';
import {Direction} from '../../core/model/direction.enum';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';


export const attachmentTypeSearchResolver: ResolveFn<boolean> = async (route, state) => {
  const store = inject(attachmentTypeStore);
  try {
    await store.search('', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, Direction.ASC, 'name')
    return true;
  } catch {
    return false;
  }
};

export const attachmentTypeFindByIdResolver:  ResolveFn<boolean> = async (route, state) => {
  const store = inject(attachmentTypeStore);
  try {
    await store.findById(route.paramMap.get('id') ?? '');
    return true;
  } catch {
    return false;
  }
}
