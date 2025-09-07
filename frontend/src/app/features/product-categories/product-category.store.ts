import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import {ProductCategoriesApi, ProductCategory, ProductCategorySortColumn} from '../../core/api/product-categories.api';
import {SuccessApiResponse, Page, ErrorApiResponse} from '../../core/model/response.model';
import {Direction} from '../../core/model/direction.enum';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';



export interface ProductCategoriesState {
  categoryPage: Page<ProductCategory>;
  column: ProductCategorySortColumn;
  current: ProductCategory | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

let initialCategoryPage = {
  elements: [],
  totalElements: 0,
  size: DEFAULT_PAGE_SIZE,
  page: DEFAULT_PAGE_NUMBER,
  totalPages: 0,
  isFirst: true,
  isLast: true
};
const initialState: ProductCategoriesState = {
  categoryPage: initialCategoryPage,
  column: 'name',
  current: null,
  loading: false,
  error: null,
  message: null,
};

export const productCategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ categoryPage, current, column, loading }) => ({
  })),
  withMethods((store) => {
    const api = inject(ProductCategoriesApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },
      async search(nameFilter: string, page: number, size: number, direction: Direction, sort: ProductCategorySortColumn) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(nameFilter, page, size, direction, sort );
        if(response.success) {
          const payload = response as SuccessApiResponse<Page<ProductCategory>>;
          patchState(store, {categoryPage: payload.data.content as any, message: payload.message ?? 'productCategories.messages.search.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'productCategories.messages.search.error', loading: false });
          return null;
        }
      },
      async findById(categoryId: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response =  await api.get(categoryId);
        if(response.success) {
          const payload = response as SuccessApiResponse<ProductCategory>;
          patchState(store, {current: payload.data.content ?? null, message: payload.message ?? 'productCategories.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'productCategories.messages.find.error', loading: false });
          return null;
        }
      },
      async create(payload: Partial<ProductCategory>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<ProductCategory>;
          patchState(store, {
            categoryPage: {
              ...store.categoryPage(),
              elements: [payload.data.content, ...store.categoryPage().elements]
            }, message: payload.message ?? 'productCategories.messages.created.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'productCategories.messages.created.error', loading: false });
          return null;
        }
      },
      async update(id: string, payload: Partial<ProductCategory>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if (response.success) {
          const payload = response as SuccessApiResponse<ProductCategory>;
          patchState(store, {
            categoryPage: {
              ...store.categoryPage(),
              elements: store.categoryPage().elements
                .map(productCategory => productCategory.id === id ? payload.data.content: productCategory)},
            message: payload.message ?? 'productCategories.messages.update.success', loading: false
          });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'productCategories.messages.update.error', loading: false });
          return null;
        }
      },
      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
          const response = await api.remove(id);
          if(response.success) {
            const payload = response as SuccessApiResponse<void>;
            patchState(store, {
              categoryPage: {
                ...store.categoryPage(),
                elements: store.categoryPage().elements.filter(productCategory => productCategory.id !== id)
              },
              message: payload.message ?? 'productCategories.messages.deleted.success', loading: false
            });
            return true;
          } else {
            const payload = response as ErrorApiResponse;
            patchState(store, { error: payload.reason ?? 'productCategories.messages.deleted.error', loading: false });
            return false;
          }
      }
    };
  })
);

export function provideCategoriesStore() {
  return [productCategoryStore];
}
