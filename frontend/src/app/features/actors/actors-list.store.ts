import { inject, computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { ActorsApi } from '../../core/api/actors.api';
import type { Actor } from './models';

export interface ActorsListState {
  items: Actor[];
  loading: boolean;
  error: string | null;
  search: string;
}

const initialState: ActorsListState = {
  items: [],
  loading: false,
  error: null,
  search: '',
};

export const ActorsListStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items, search }) => ({
    filtered: computed(() => {
      const q = (search() || '').toLowerCase().trim();
      if (!q) return items();
      return items().filter(a => (a.name || '').toLowerCase().includes(q));
    })
  })),
  withMethods((store) => {
    const api = inject(ActorsApi);

    return {
      setSearch(q: string) { patchState(store, { search: q }); },

      async loadAll() {
        patchState(store, { loading: true, error: null });
        try {
          const list = await api.list();
          patchState(store, { items: list ?? [] });
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de chargement' });
        } finally {
          patchState(store, { loading: false });
        }
      },

      async remove(id: string) {
        patchState(store, { loading: true, error: null });
        try {
          await api.remove(id);
          patchState(store, { items: store.items().filter(a => a.id !== id) });
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

export function provideActorsListStore() { return [ActorsListStore]; }
