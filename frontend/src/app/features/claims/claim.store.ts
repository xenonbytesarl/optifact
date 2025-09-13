import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import {ClaimApi, Claim, ClaimSortColumn} from '../../core/api/claim.api';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../../core/model/response.model';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {Direction} from '../../core/model/direction.enum';

export interface ClaimsState {
  claimPage: Page<Claim>;
  column: ClaimSortColumn;
  current: Claim | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

let initialClaimPage: Page<Claim> = {
  elements: [],
  totalElements: 0,
  size: DEFAULT_PAGE_SIZE,
  page: DEFAULT_PAGE_NUMBER,
  totalPages: 0,
  isFirst: true,
  isLast: true
};

const initialState: ClaimsState = {
  claimPage: initialClaimPage,
  column: 'createdAt',
  current: null,
  loading: false,
  error: null,
  message: null,
};

export const claimStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(ClaimApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },

      async search(
        referenceFilter: string,
        stateFilter: string,
        actorNameFilter: string,
        productNameFilter: string,
        page: number,
        size: number,
        direction: Direction,
        sort: ClaimSortColumn
      ) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(referenceFilter, stateFilter, actorNameFilter, productNameFilter,  page, size, sort, direction);
        if (response.success) {
          const payload = response as SuccessApiResponse<Page<Claim>>;
          patchState(store, { claimPage: payload.data.content as any, message: payload.message ?? 'claims.messages.search.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'claims.messages.search.error', loading: false });
          return null;
        }
      },
      async findById(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.get(id);
        if (response.success) {
          const payload = response as SuccessApiResponse<Claim>;
          patchState(store, { current: payload.data.content ?? null, message: payload.message ?? 'claims.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'claims.messages.find.error', loading: false });
          return null;
        }
      },
      async create(payload: Partial<Claim>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Claim>;
          patchState(store, {
            claimPage: {
              ...store.claimPage(),
              elements: [payload.data.content, ...store.claimPage().elements]
            },
            current: payload.data.content,
            message: payload.message ?? 'claims.messages.created.success',
            loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'claims.messages.created.error', loading: false });
          return null;
        }
      },
      async update(id: string, payload: Partial<Claim>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Claim>;
          patchState(store, {
            claimPage: {
              ...store.claimPage(),
              elements: store.claimPage().elements.map(c => c.id === id ? payload.data.content : c)
            },
            current: payload.data.content,
            message: payload.message ?? 'claims.messages.update.success',
            loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'claims.messages.update.error', loading: false });
          return null;
        }
      },
      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.remove(id);
        if (response.success) {
          const payload = response as SuccessApiResponse<void>;
          patchState(store, {
            claimPage: {
              ...store.claimPage(),
              elements: store.claimPage().elements.filter(c => c.id !== id)
            },
            message: payload.message ?? 'claims.messages.deleted.success',
            loading: false
          });
          return true;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'claims.messages.deleted.error', loading: false });
          return false;
        }
      }
    };
  })
);

export function provideClaimsStore() {
  return [claimStore];
}
