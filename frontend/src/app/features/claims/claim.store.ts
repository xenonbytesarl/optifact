import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import {ClaimApi, Claim, ClaimSortColumn, AttachmentTransfert, AttachementDownload} from '../../core/api/claim.api';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../../core/model/response.model';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {Direction} from '../../core/model/direction.enum';
import { finalize, tap } from 'rxjs/operators';

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
      },
      async transfertAttachment(attachmentTransfert: AttachmentTransfert) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.transfertAttachment(attachmentTransfert);
        if (response.success) {
          const payload = response as SuccessApiResponse<Claim>;
          patchState(store, {
            claimPage: {
              ...store.claimPage(),
              elements: store.claimPage().elements.map(c => c.id === attachmentTransfert.claimId ? payload.data.content : c)
            },
            current: payload.data.content,
            message: payload.message ?? 'claims.messages.attachment.transfert.success',
            loading: false
          });
          return true;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'claims.messages.attachment.transfert.error', loading: false });
          return false;
        }
      },
      async downloadAttachment(claimId: string, attachmentId: string) {
        patchState(store, {loading: true, error: null, message: null});
        const response = await api.downloadAttachment(claimId, attachmentId);
        if (response.success) {
          try {
            const { blob, filename } = response as AttachementDownload;
            // Fallback filename if missing
            const safeName = filename && filename.trim().length > 0 ? filename : `attachment-${attachmentId}`;
            // Create an object URL and trigger a download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = safeName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            // Cleanup
            setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 0);

            patchState(store, {
              message: 'claims.messages.attachment.download.success',
              loading: false
            });
            return true;
          } catch (e: any) {
            patchState(store, { error: e?.message ?? 'claims.messages.attachment.download.error', loading: false });
            return false;
          }
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'claims.messages.attachment.download.error', loading: false });
          return false;
        }
      },
      transfertAttachmentWithProgress(attachmentTransfert: AttachmentTransfert) {
        patchState(store, { loading: true, error: null, message: null });
        return api.transfertAttachmentWithProgress(attachmentTransfert).pipe(
          tap((event: any) => {
            // On final HTTP response, update store state similar to async version
            if (event?.type === 4) {
              const res: any = event.body;
              if (res?.success) {
                const payload = res as SuccessApiResponse<Claim>;
                patchState(store, {
                  claimPage: {
                    ...store.claimPage(),
                    elements: store.claimPage().elements.map(c => c.id === attachmentTransfert.claimId ? payload.data.content : c)
                  },
                  current: payload.data.content,
                  message: payload.message ?? 'claims.messages.attachment.transfert.success',
                  loading: false
                });
              } else if (res) {
                const payload = res as ErrorApiResponse;
                patchState(store, { error: payload.reason ?? 'claims.messages.attachment.transfert.error', loading: false });
              }
            }
          }),
          finalize(() => {
            // Ensure loading is reset even if a network error occurs
            if (store.loading()) {
              patchState(store, { loading: false });
            }
          })
        );
      }
    };
  })
);

export function provideClaimsStore() {
  return [claimStore];
}
