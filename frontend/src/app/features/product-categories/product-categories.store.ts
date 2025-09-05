import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { ProductCategoriesApi, ProductCategory } from '../../core/api/product-categories.api';

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
      return categories().filter(c => c.name?.toLowerCase().includes(q));
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
        try {
          const data = await api.list();
          patchState(store, { categories: data ?? [] });
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de chargement' });
        } finally {
          patchState(store, { loading: false });
        }
      },
      async create(payload: Partial<ProductCategory>) {
        patchState(store, { loading: true, error: null });
        try {
          const created = await api.create(payload);
          if (created) {
            patchState(store, { categories: [created, ...store.categories()] });
          }
          return created;
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
          const updated = await api.update(id, payload);
          if (updated) {
            patchState(store, {
              categories: store.categories().map(c => c.id === id ? updated : c)
            });
          }
          return updated;
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
