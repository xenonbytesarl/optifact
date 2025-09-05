import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { ProductsApi, Product, ProductType } from '../../core/api/products.api';

export interface ProductsState {
  products: Product[];
  current: Product | null;
  search: string;
  type: ProductType | 'all';
  categoryId: string | 'all';
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  current: null,
  search: '',
  type: 'all',
  categoryId: 'all',
  loading: false,
  error: null,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ products, search, type, categoryId, loading }) => ({
    filtered: computed(() => {
      const q = (search() || '').toLowerCase();
      return products().filter(p => {
        const matchQ = !q || p.name?.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q);
        const matchType = type() === 'all' || p.type === type();
        const matchCat = categoryId() === 'all' || (!categoryId() ? !p.categoryId : p.categoryId === categoryId());
        return matchQ && matchType && matchCat;
      });
    }),
    canSave: computed(() => !loading())
  })),
  withMethods((store) => {
    const api = inject(ProductsApi);

    return {
      setSearch(q: string) { patchState(store, { search: q }); },
      setType(t: ProductsState['type']) { patchState(store, { type: t }); },
      setCategory(c: ProductsState['categoryId']) { patchState(store, { categoryId: c }); },
      setCurrent(p: Product | null) { patchState(store, { current: p }); },

      async loadAll() {
        patchState(store, { loading: true, error: null });
        try {
          const data = await api.list();
          patchState(store, { products: data ?? [] });
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de chargement' });
        } finally {
          patchState(store, { loading: false });
        }
      },
      async create(payload: Partial<Product>) {
        patchState(store, { loading: true, error: null });
        try {
          const created = await api.create(payload);
          if (created) {
            patchState(store, { products: [created, ...store.products()] });
          }
          return created;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de création' });
          throw e;
        } finally {
          patchState(store, { loading: false });
        }
      },
      async update(id: string, payload: Partial<Product>) {
        patchState(store, { loading: true, error: null });
        try {
          const updated = await api.update(id, payload);
          if (updated) {
            patchState(store, { products: store.products().map(p => p.id === id ? updated : p) });
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
          patchState(store, { products: store.products().filter(p => p.id !== id) });
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

export function provideProductsStore() {
  return [ProductsStore];
}
