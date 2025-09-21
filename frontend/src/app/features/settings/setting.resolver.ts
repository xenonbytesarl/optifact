import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import { settingStore } from './setting.store';

export const settingFindByIdResolver: ResolveFn<boolean> = async (route) => {
  const store = inject(settingStore);
  try {
    const id = route.paramMap.get('id') ?? '';
    await store.findById(id);
    return true;
  } catch {
    return false;
  }
};
