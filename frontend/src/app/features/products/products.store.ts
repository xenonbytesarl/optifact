import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import {ProductsApi, Product, ProductSortColumn} from '../../core/api/products.api';
import {ErrorApiResponse, Page, SuccessApiResponse} from '../../core/model/response.model';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';
import {Direction} from '../../core/model/direction.enum';

export interface ProductsState {
  productPage: Page<Product>;
  column: ProductSortColumn;
  current: Product | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

let initialProductPage = {
  elements: [],
  totalElements: 0,
  size: DEFAULT_PAGE_SIZE,
  page: DEFAULT_PAGE_NUMBER,
  totalPages: 0,
  isFirst: true,
  isLast: true
};

const initialState: ProductsState = {
  productPage: initialProductPage,
  column: 'name',
  current: null,
  loading: false,
  error: null,
  message: null,
};

export const productStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(ProductsApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },

      async search(
        nameFilter: string,
        claimNameFilter: string,
        codeFilter: string,
        typeFilter: string,
        categoryNameFilter: string,
        page: number,
        size: number,
        direction: Direction,
        sort: ProductSortColumn
      ) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(nameFilter, claimNameFilter, codeFilter, typeFilter, categoryNameFilter, page, size, direction, sort );
        if(response.success) {
          const payload = response as SuccessApiResponse<Page<Product>>;
          patchState(store, {productPage: payload.data.content as any, message: payload.message ?? 'products.messages.search.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'products.messages.search.error', loading: false });
          return null;
        }
      },
      async findById(productId: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response =  await api.get(productId);
        if(response.success) {
          const payload = response as SuccessApiResponse<Product>;
          patchState(store, {current: payload.data.content ?? null, message: payload.message ?? 'products.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'products.messages.find.error', loading: false });
          return null;
        }
      },
      async create(payload: Partial<Product>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Product>;
          patchState(store, {
            productPage: {
              ...store.productPage(),
              elements: [payload.data.content, ...store.productPage().elements]
            },
            current: payload.data.content,
            message: payload.message ?? 'products.messages.created.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'products.messages.created.error', loading: false });
          return null;
        }
      },
      async update(id: string, payload: Partial<Product>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<Product>;
          patchState(store, {
            productPage: {
              ...store.productPage(),
              elements: store.productPage().elements
                .map(product => product.id === id ? payload.data.content: product)},
            current: payload.data.content,
            message: payload.message ?? 'products.messages.update.success', loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'products.messages.update.error', loading: false });
          return null;
        }
      },
      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.remove(id);
        if(response.success) {
          const payload = response as SuccessApiResponse<void>;
          patchState(store, {
            productPage: {
              ...store.productPage(),
              elements: store.productPage().elements.filter(product => product.id !== id)
            },
            message: payload.message ?? 'products.messages.deleted.success', loading: false
          });
          return true;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'products.messages.deleted.error', loading: false });
          return false;
        }
      }
    };
  })
);

export function provideProductsStore() {
  return [productStore];
}
