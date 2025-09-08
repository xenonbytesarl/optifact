import { inject, computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { ActorsApi } from '../../core/api/actor/actors.api';
import { Address, Contact, Actor } from '../../core/api/actor/models';

export interface ActorsState {
  currentActor: Actor | null;
  addresses: Address[];
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  formDirty: boolean;
}

const initialState: ActorsState = {
  currentActor: null,
  addresses: [],
  contacts: [],
  loading: false,
  error: null,
  formDirty: false,
};

export const ActorsStore = signalStore(
  // Keep providedIn so it can be root-provided; component-level providers can still override per injector
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ addresses, contacts, loading, currentActor }) => ({
    addressesCount: computed(() => addresses().length),
    contactsCount: computed(() => contacts().length),
    canSave: computed(() => {
      const c = currentActor();
      return !!c && (c.name?.trim().length ?? 0) >= 2 && !loading();
    }),
  })),
  withMethods((store) => {
    const api = inject(ActorsApi);

    return {
      setActor(c: Actor | null) {
        patchState(store, {
          currentActor: c,
          addresses: c?.addresses ?? [],
          contacts: c?.contacts ?? [],
          formDirty: false,
        });
      },

      addAddress(a: Address) {
        const list = [...store.addresses()];
        // ensure only one default
        if (a.type === 'défaut') {
          for (const item of list) {
            if (item.type === 'défaut') item.type = 'autres';
          }
        }
        patchState(store, { addresses: [a, ...list], formDirty: true });
      },

      updateAddress(a: Address) {
        patchState(store, {
          addresses: store.addresses().map((x) => (x.id === a.id ? a : x)),
          formDirty: true,
        });
      },

      removeAddress(id: string) {
        patchState(store, {
          addresses: store.addresses().filter((x) => x.id !== id),
          formDirty: true,
        });
      },

      addContact(c: Contact) {
        patchState(store, { contacts: [c, ...store.contacts()], formDirty: true });
      },

      updateContact(c: Contact) {
        patchState(store, {
          contacts: store.contacts().map((x) => (x.id === c.id ? c : x)),
          formDirty: true,
        });
      },

      removeContact(id: string) {
        patchState(store, {
          contacts: store.contacts().filter((x) => x.id !== id),
          formDirty: true,
        });
      },

      async load(id: string) {
        patchState(store, { loading: true, error: null });
        try {
          const data = await api.get(id);
          if (data) this.setActor(data);
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de chargement' });
        } finally {
          patchState(store, { loading: false });
        }
      },

      async create(payload: Partial<Actor>) {
        patchState(store, { loading: true, error: null });
        try {
          const created = await api.create({
            ...payload,
            addresses: store.addresses(),
            contacts: store.contacts(),
          });
          this.setActor(created as Actor);
          return created;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de création' });
          throw e;
        } finally {
          patchState(store, { loading: false });
        }
      },

      async update(id: string, payload: Partial<Actor>) {
        patchState(store, { loading: true, error: null });
        try {
          const updated = await api.update(id, {
            ...payload,
            addresses: store.addresses(),
            contacts: store.contacts(),
          });
          this.setActor(updated as Actor);
          return updated;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'Erreur de mise à jour' });
          throw e;
        } finally {
          patchState(store, { loading: false });
        }
      },
    };
  })
);

export function provideActorsStore() {
  // Providing the store at component/route level will create a new instance scoped to that injector
  return [ActorsStore];
}
