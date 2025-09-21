import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { userStore } from './user.store';

export const userFindByIdResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id');
  const store = inject(userStore);
  if (id) {
    await store.findById(id);
  } else {
    store.resetForm();
  }
  await store.loadRoles();
  return true;
};

export const roleFindAllResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot) => {
  const store = inject(userStore);
  try {
    await store.loadRoles();
    return true;
  } catch {
    return false;
  }
}
