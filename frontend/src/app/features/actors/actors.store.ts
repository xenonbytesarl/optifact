import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { ActorsApi } from '../../core/api/actor/actors.api';
import {Actor, ActorSortColumn} from '../../core/api/actor/models';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../../core/model/response.model';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {Direction} from '../../core/model/direction.enum';

export interface ActorsState {
  actorPage: Page<Actor>;
  column: ActorSortColumn;
  current: Actor | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

let initialActorPage = {
  elements: [],
  totalElements: 0,
  size: DEFAULT_PAGE_SIZE,
  page: DEFAULT_PAGE_NUMBER,
  totalPages: 0,
  isFirst: true,
  isLast: true
};

const initialState: ActorsState = {
  actorPage: initialActorPage,
  column: 'name',
  current: null,
  loading: false,
  error: null,
  message: null
};

export const actorStore = signalStore(
  // Keep providedIn so it can be root-provided; component-level providers can still override per injector
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(ActorsApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },

      async search(
        nameFilter: string,
        referenceFilter: string,
        page: number,
        size: number,
        direction: Direction,
        sort: ActorSortColumn
      ) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(nameFilter, referenceFilter, page, size, direction, sort );
        if(response.success) {
          const payload = response as SuccessApiResponse<Page<Actor>>;
          patchState(store, {actorPage: payload.data.content as any, message: payload.message ?? 'actors.messages.search.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'actors.messages.search.error', loading: false });
          return null;
        }
      },
      async findById(actorId: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response =  await api.get(actorId);
        if(response.success) {
          const payload = response as SuccessApiResponse<Actor>;
          patchState(store, {current: payload.data.content ?? null, message: payload.message ?? 'actors.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'actors.messages.find.error', loading: false });
          return null;
        }
      },
      async create(payload: Partial<Actor>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Actor>;
          patchState(store, {
            actorPage: {
              ...store.actorPage(),
              elements: [payload.data.content, ...store.actorPage().elements]
            }, message: payload.message ?? 'actors.messages.created.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'actors.messages.created.error', loading: false });
          return null;
        }
      },
      async update(id: string, payload: Partial<Actor>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Actor>;
          patchState(store, {
            actorPage: {
              ...store.actorPage(),
              elements: store.actorPage().elements
                .map(actor => actor.id === id ? payload.data.content: actor)},
            message: payload.message ?? 'actors.messages.update.success', loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'actors.messages.update.error', loading: false });
          return null;
        }
      },
      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.remove(id);
        if(response.success) {
          const payload = response as SuccessApiResponse<void>;
          patchState(store, {
            actorPage: {
              ...store.actorPage(),
              elements: store.actorPage().elements.filter(actor => actor.id !== id)
            },
            message: payload.message ?? 'actors.messages.deleted.success', loading: false
          });
          return true;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'actors.messages.deleted.error', loading: false });
          return false;
        }
      }
    };
  })
);

export function provideActorStore() {
  // Providing the store at component/route level will create a new instance scoped to that injector
  return [actorStore];
}
