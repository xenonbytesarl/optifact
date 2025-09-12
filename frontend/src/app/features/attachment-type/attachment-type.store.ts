import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import {AttachmentType, AttachmentTypeSortColumn, AttachmentTypesApi} from '../../core/api/attachment-types.api';
import {SuccessApiResponse, Page, ErrorApiResponse} from '../../core/model/response.model';
import {Direction} from '../../core/model/direction.enum';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';



export interface AttachmentTypeState {
  attachmentTypePage: Page<AttachmentType>;
  currentAttachmentTypes: AttachmentType[];
  column: AttachmentTypeSortColumn;
  current: AttachmentType | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

let initialAttachmentTypePage = {
  elements: [],
  totalElements: 0,
  size: DEFAULT_PAGE_SIZE,
  page: DEFAULT_PAGE_NUMBER,
  totalPages: 0,
  isFirst: true,
  isLast: true
};
const initialState: AttachmentTypeState = {
  attachmentTypePage: initialAttachmentTypePage,
  currentAttachmentTypes: [],
  column: 'name',
  current: null,
  loading: false,
  error: null,
  message: null,
};

export const attachmentTypeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ attachmentTypePage, current, column, loading }) => ({
  })),
  withMethods((store) => {
    const api = inject(AttachmentTypesApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },
      async search(nameFilter: string, page: number, size: number, direction: Direction, sort: AttachmentTypeSortColumn) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(nameFilter, page, size, direction, sort );
        if(response.success) {
          const payload = response as SuccessApiResponse<Page<AttachmentType>>;
          patchState(store, {attachmentTypePage: payload.data.content as any, message: payload.message ?? 'attachmentTypes.messages.search.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'attachmentTypes.messages.search.error', loading: false });
          return null;
        }
      },
      async findById(attachmentTypeId: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response =  await api.get(attachmentTypeId);
        if(response.success) {
          const payload = response as SuccessApiResponse<AttachmentType>;
          patchState(store, {current: payload.data.content ?? null, message: payload.message ?? 'attachmentTypes.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'attachmentTypes.messages.find.error', loading: false });
          return null;
        }
      },
      async create(payload: Partial<AttachmentType>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<AttachmentType>;
          patchState(store, {
            attachmentTypePage: {
              ...store.attachmentTypePage(),
              elements: [payload.data.content, ...store.attachmentTypePage().elements]
            },
            current: payload.data.content,
            message: payload.message ?? 'attachmentTypes.messages.created.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'attachmentTypes.messages.created.error', loading: false });
          return null;
        }
      },
      async update(id: string, payload: Partial<AttachmentType>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<AttachmentType>;
          patchState(store, {
            attachmentTypePage: {
              ...store.attachmentTypePage(),
              elements: store.attachmentTypePage().elements
                .map(attachmentType => attachmentType.id === id ? payload.data.content: attachmentType)},
            current: payload.data.content,
            message: payload.message ?? 'attachmentTypes.messages.update.success', loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'attachmentTypes.messages.update.error', loading: false });
          return null;
        }
      },
      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
          const response = await api.remove(id);
          if(response.success) {
            const payload = response as SuccessApiResponse<void>;
            patchState(store, {
              attachmentTypePage: {
                ...store.attachmentTypePage(),
                elements: store.attachmentTypePage().elements.filter(attachmentType => attachmentType.id !== id)
              },
              message: payload.message ?? 'attachmentTypes.messages.deleted.success', loading: false
            });
            return true;
          } else {
            const payload = response as ErrorApiResponse;
            patchState(store, { error: payload.reason ?? 'attachmentTypes.messages.deleted.error', loading: false });
            return false;
          }
      },
      async findByIds(ids: string[]) {
        if (!ids || ids.length === 0) return [] as AttachmentType[];
        patchState(store, { loading: true, error: null, message: null, currentAttachmentTypes: [] as AttachmentType[] });
        const response = await api.findByIds(ids);
        if (response.success) {
          const payload = response as SuccessApiResponse<AttachmentType[]>;
          // do not override the page; just return and let caller merge/use
          patchState(store, {
            loading: false,
            message: payload.message ?? 'attachmentTypes.messages.findMany.success',
            currentAttachmentTypes: payload.data.content ?? [] as AttachmentType[]
          });
          return (payload.data.content ?? []) as AttachmentType[];
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payload.reason ?? 'attachmentTypes.messages.findMany.error' });
          return [] as AttachmentType[];
        }
      }
    };
  })
);

export function provideCategoriesStore() {
  return [attachmentTypeStore];
}
