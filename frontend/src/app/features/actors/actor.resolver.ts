import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {Direction} from '../../core/model/direction.enum';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {actorStore} from './actors.store';


export const actorSearchResolver: ResolveFn<boolean> = async (route, state) => {
  const store = inject(actorStore);
  try {
    await store.search('', '', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, Direction.ASC, 'name')
    return true;
  } catch {
    return false;
  }
};

export const actorFindByIdResolver:  ResolveFn<boolean> = async (route, state) => {
  const store = inject(actorStore);
  try {
    await store.findById(route.paramMap.get('id') ?? '');
    return true;
  } catch {
    return false;
  }
}
