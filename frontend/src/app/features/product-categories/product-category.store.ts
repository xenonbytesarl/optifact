import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import {ProductCategoriesApi, ProductCategory, ProductCategorySortColumn} from '../../core/api/product-categories.api';
import { SuccessApiResponse, Page } from '../../core/model/response.model';
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
  withComputed(({ categoryPage, column, loading }) => ({
  })),
  withMethods((store) => {
    const api = inject(ProductCategoriesApi);

    return {
      async search(nameFilter: string, page: number, size: number, direction: Direction, sort: ProductCategorySortColumn) {
        patchState(store, { loading: true, error: null, message: null });
        try {
          const response = await api.search(nameFilter, page, size, direction, sort );
          if(response.success) {
            const payload = response as SuccessApiResponse<Page<ProductCategory>>;
            patchState(store, {categoryPage: payload.data.content as any, message: payload.message ?? 'productCategory.messages.search.success' });
          }
          return response.data.content;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'productCategory.messages.search.error' });
          return false;
        } finally {
          patchState(store, { loading: false });
        }
      },
      async findById(categoryId: string) {
        patchState(store, { loading: true, error: null, message: null });
        try {
          const response =  await api.get(categoryId);
          if(response.success) {
            const payload = response as SuccessApiResponse<ProductCategory>;
            patchState(store, {current: payload.data.content ?? null, message: payload.message ?? 'productCategory.messages.find.success' });
          }
          return response.data.content;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'productCategory.messages.find.error' });
          return false;
        } finally {
          patchState(store, { loading: false });
        }
      },
      async create(payload: Partial<ProductCategory>) {
        patchState(store, { loading: true, error: null, message: null });
        try {
          const response = await api.create(payload);
          if (response) {
            const payload = response as SuccessApiResponse<ProductCategory>;
            patchState(store, {
              categoryPage: {
                ...store.categoryPage(),
                elements: [payload.data.content, ...store.categoryPage().elements]
              }, message: payload.message ?? 'productCategory.messages.created.success' });
          }
          return response.data.content;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'productCategory.messages.created.error' });
          return false;
        } finally {
          patchState(store, { loading: false });
        }
      },
      async update(id: string, payload: Partial<ProductCategory>) {
        patchState(store, { loading: true, error: null, message: null });
        try {
          const response = await api.update(id, payload);
          if (response) {
            const payload = response as SuccessApiResponse<ProductCategory>;
            patchState(store, {
              categoryPage: {
                ...store.categoryPage(),
                elements: store.categoryPage().elements
                  .map(productCategory => productCategory.id === id ? payload.data.content: productCategory)},
              message: payload.message ?? 'productCategory.messages.update.success'
            });
          }
          return response.data.content;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'productCategory.messages.update.error' });
          return false;
        } finally {
          patchState(store, { loading: false });
        }
      },
      async remove(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        try {
          const response = await api.remove(id);
          if(response.success) {
            const payload = response as SuccessApiResponse<void>;
            patchState(store, {
              categoryPage: {
                ...store.categoryPage(),
                elements: store.categoryPage().elements.filter(productCategory => productCategory.id !== id)
              },
              message: payload.message ?? 'productCategories.messages.deleted.success'
            });
          }
          return true;
        } catch (e: any) {
          patchState(store, { error: e?.message ?? 'productCategories.messages.deleted.error' });
          return false;
        } finally {
          patchState(store, { loading: false });
        }
      }
    };
  })
);

export function provideCategoriesStore() {
  return [productCategoryStore];
}
