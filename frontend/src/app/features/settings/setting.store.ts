import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import {ErrorApiResponse, SuccessApiResponse} from '../../core/model/response.model';
import { Setting, SettingApi, SettingPayload } from '../../core/api/setting.api';

export interface SettingState {
  current: Setting | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: SettingState = {
  current: null,
  loading: false,
  error: null,
  message: null,
};

export const settingStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(SettingApi);

    return {
      resetForm(): void {
        patchState(store, { current: null });
      },

      async findById(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.get(id);
        if (response.success) {
          const payload = response as SuccessApiResponse<Setting>;
          patchState(store, { current: payload.data.content ?? null, message: payload.message ?? 'setting.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'setting.messages.find.error', loading: false });
          return null;
        }
      },

      async findFirst() {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.getFirst();
        if (response.success) {
          const payload = response as SuccessApiResponse<Setting>;
          patchState(store, { current: payload.data.content ?? null, message: payload.message ?? 'setting.messages.find.success', loading: false });
          return payload.data.content;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { error: payload.reason ?? 'setting.messages.find.error', loading: false });
          return null;
        }
      },

      async update(id: string, payload: SettingPayload) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if (response.success) {
          const payloadResp = response as SuccessApiResponse<Setting>;
          patchState(store, { current: payloadResp.data.content ?? null, message: payloadResp.message ?? 'setting.messages.update.success', loading: false });
          return payloadResp.data.content;
        } else {
          const payloadErr = response as ErrorApiResponse;
          patchState(store, { error: payloadErr.reason ?? 'setting.messages.update.error', loading: false });
          return null;
        }
      },
    };
  })
);

export function provideSettingStore() {
  return [settingStore];
}
