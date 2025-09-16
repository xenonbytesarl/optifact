import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { ErrorApiResponse, Page, SuccessApiResponse} from '../../core/model/response.model';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../core/constant/constant';
import { Direction } from '../../core/model/direction.enum';
import { InvoiceApi, Invoice, InvoiceSortColumn } from '../../core/api/invoice.api';

export interface InvoicesState {
  invoicePage: Page<Invoice>;
  column: InvoiceSortColumn;
  current: Invoice | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialInvoicePage: Page<Invoice> = {
  elements: [],
  totalElements: 0,
  size: DEFAULT_PAGE_SIZE,
  page: DEFAULT_PAGE_NUMBER,
  totalPages: 0,
  isFirst: true,
  isLast: true
};

const initialState: InvoicesState = {
  invoicePage: initialInvoicePage,
  column: 'createdAt',
  current: null,
  loading: false,
  error: null,
  message: null
};

export const invoiceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(InvoiceApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },

      async search(
        referenceFilter: string,
        actorNameFilter: string,
        claimNameFilter: string,
        stateFilter: string,
        page: number,
        size: number,
        direction: Direction,
        sort: InvoiceSortColumn
      ) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(referenceFilter, actorNameFilter, claimNameFilter, stateFilter, page, size, sort, direction);
        if ((response as any).success) {
          const payload = response as SuccessApiResponse<Page<Invoice>>;
          patchState(store, { invoicePage: payload.data.content as any, message: payload.message ?? 'invoices.messages.search.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'invoices.messages.search.error', loading: false });
          return null;
        }
      },

      async findById(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.get(id);
        if ((response as any).success) {
          const payload = response as SuccessApiResponse<Invoice>;
          patchState(store, { current: payload.data.content ?? null, message: payload.message ?? 'invoices.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'invoices.messages.find.error', loading: false });
          return null;
        }
      },

      async create(payload: Partial<Invoice>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if ((response as any).success) {
          const payload = response as SuccessApiResponse<Invoice>;
          patchState(store, {
            invoicePage: {
              ...store.invoicePage(),
              elements: [payload.data.content, ...store.invoicePage().elements]
            },
            current: payload.data.content,
            message: payload.message ?? 'invoices.messages.created.success',
            loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'invoices.messages.created.error', loading: false });
          return null;
        }
      },

      async update(id: string, payload: Partial<Invoice>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if ((response as any).success) {
          const payload = response as SuccessApiResponse<Invoice>;
          patchState(store, {
            invoicePage: {
              ...store.invoicePage(),
              elements: store.invoicePage().elements.map(c => c.id === id ? payload.data.content : c)
            },
            current: payload.data.content,
            message: payload.message ?? 'invoices.messages.update.success',
            loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'invoices.messages.update.error', loading: false });
          return null;
        }
      },

      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.remove(id);
        if ((response as any).success) {
          patchState(store, {
            invoicePage: {
              ...store.invoicePage(),
              elements: store.invoicePage().elements.filter(c => c.id !== id)
            },
            message: (response as any).message ?? 'invoices.messages.remove.success',
            loading: false
          });
          return true;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'invoices.messages.remove.error', loading: false });
          return false;
        }
      }
    };
  })
);
