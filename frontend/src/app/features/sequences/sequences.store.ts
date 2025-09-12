import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import {Direction} from '../../core/model/direction.enum';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../../core/model/response.model';
import {Sequence, SequenceSortColumn, SequencesApi} from '../../core/api/sequences.api';

export interface SequencesState {
  sequencePage: Page<Sequence>;
  column: SequenceSortColumn;
  current: Sequence | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialSequencePage: Page<Sequence> = {
  elements: [],
  totalElements: 0,
  size: DEFAULT_PAGE_SIZE,
  page: DEFAULT_PAGE_NUMBER,
  totalPages: 0,
  isFirst: true,
  isLast: true
};

const initialState: SequencesState = {
  sequencePage: initialSequencePage,
  column: 'name',
  current: null,
  loading: false,
  error: null,
  message: null,
};

export const sequencesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(SequencesApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },

      async search(
        nameFilter: string,
        codeFilter: string,
        prefixFilter: string,
        suffixFilter: string,
        page: number,
        size: number,
        direction: Direction,
        sort: SequenceSortColumn
      ) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(nameFilter, codeFilter, prefixFilter, suffixFilter, page, size, direction, sort );
        if(response.success) {
          const payload = response as SuccessApiResponse<Page<Sequence>>;
          patchState(store, {sequencePage: payload.data.content as any, message: payload.message ?? 'sequences.messages.search.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'sequences.messages.search.error', loading: false });
          return null;
        }
      },

      async findById(sequenceId: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response =  await api.get(sequenceId);
        if(response.success) {
          const payload = response as SuccessApiResponse<Sequence>;
          patchState(store, {current: payload.data.content ?? null, message: payload.message ?? 'sequences.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'sequences.messages.find.error', loading: false });
          return null;
        }
      },

      async findByCode(code: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response =  await api.findByCode(code);
        if(response.success) {
          const payload = response as SuccessApiResponse<Sequence>;
          patchState(store, {current: payload.data.content ?? null, message: payload.message ?? 'sequences.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'sequences.messages.find.error', loading: false });
          return null;
        }
      },

      async create(payload: Partial<Sequence>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Sequence>;
          patchState(store, {
            sequencePage: {
              ...store.sequencePage(),
              elements: [payload.data.content, ...store.sequencePage().elements]
            },
            current: payload.data.content,
            message: payload.message ?? 'sequences.messages.created.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'sequences.messages.created.error', loading: false });
          return null;
        }
      },

      async update(id: string, payload: Partial<Sequence>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Sequence>;
          patchState(store, {
            sequencePage: {
              ...store.sequencePage(),
              elements: store.sequencePage().elements
                .map(sequence => sequence.id === id ? payload.data.content: sequence)},
            current: payload.data.content,
            message: payload.message ?? 'sequences.messages.update.success', loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'sequences.messages.update.error', loading: false });
          return null;
        }
      },

      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.remove(id);
        if(response.success) {
          const payload = response as SuccessApiResponse<void>;
          patchState(store, {
            sequencePage: {
              ...store.sequencePage(),
              elements: store.sequencePage().elements.filter(sequence => sequence.id !== id)
            },
            message: payload.message ?? 'sequences.messages.deleted.success', loading: false
          });
          return true;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'sequences.messages.deleted.error', loading: false });
          return false;
        }
      }
    };
  })
);

export function provideSequencesStore() {
  return [sequencesStore];
}
