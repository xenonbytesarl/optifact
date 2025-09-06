import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import {Page, ProductCategoriesApi, ProductCategory} from '../../core/api/product-categories.api';
import {SuccessApiResponse} from '../../core/model/response.model';

export interface ProductCategoriesState {
  categories: ProductCategory[];
  current: ProductCategory | null;
  search: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductCategoriesState = {
  categories: [],
  current: null,
  search: '',
  loading: false,
  error: null,
};

export const ProductCategoriesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ categories, search, loading }) => ({
    filtered: computed(() => {
      const q = (search() || '').toLowerCase();
      const list = Array.isArray(categories()) ? categories() : [];
      return list.filter(c => c.name?.toLowerCase().includes(q));
    }),
    canSave: computed(() => {
      // name required, at least 1 char, and not loading
      return !loading();
    })
  })),
  withMethods((store) => {
    const api = inject(ProductCategoriesApi);

    return {
      setSearch(q: string) {
        patchState(store, { search: q });
      },
      setCurrent(c: ProductCategory | null) {
        patchState(store, { current: c });
      },
      async loadAll() {
        patchState(store, { loading: true, error: null });
        console.log('loadAll');
        try {
          const response = await api.list();
          if(response.success) {
            const payload = response as SuccessApiResponse<Page<ProductCategory>>;
            patchState(store, { categories: payload.data.content.elements ?? [] });
          }

        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de chargement' });
        } finally {
          patchState(store, { loading: false });
        }
      },
      async create(payload: Partial<ProductCategory>) {
        patchState(store, { loading: true, error: null });
        try {
          const response = await api.create(payload);
          if (response) {
            const payload = response as SuccessApiResponse<ProductCategory>;
            patchState(store, { categories: [payload.data.content, ...store.categories()] });
          }
          return response.data.content;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de création' });
          throw e;
        } finally {
          patchState(store, { loading: false });
        }
      },
      async update(id: string, payload: Partial<ProductCategory>) {
        patchState(store, { loading: true, error: null });
        try {
          const response = await api.update(id, payload);
          if (response) {
            const payload = response as SuccessApiResponse<ProductCategory>;
            patchState(store, {
              categories: store.categories().map(c => c.id === id ? payload.data.content : c)
            });
          }
          return response.data.content;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de mise à jour' });
          throw e;
        } finally {
          patchState(store, { loading: false });
        }
      },
      async remove(id: string) {
        patchState(store, { loading: true, error: null });
        try {
          await api.remove(id);
          patchState(store, { categories: store.categories().filter(c => c.id !== id) });
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de suppression' });
          throw e;
        } finally {
          patchState(store, { loading: false });
        }
      }
    };
  })
);

export function provideCategoriesStore() {
  return [ProductCategoriesStore];
}
