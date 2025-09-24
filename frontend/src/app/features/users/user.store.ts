import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { UserApi, UserView, RoleView, RegisterUserRequest, CreateUserPasswordRequest, LoginApiRequest, LoginResponse } from '../../core/api/user.api';
import { ErrorApiResponse, SuccessApiResponse, Page } from '../../core/model/response.model';

const AUTH_STORAGE_KEY = 'optifact.auth';

export interface UsersState {
  current: UserView | null;
  auth: LoginResponse | null;
  loggedIn: boolean;
  roles: RoleView[];
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: UsersState = {
  current: null,
  auth: null,
  loggedIn: false,
  roles: [],
  loading: false,
  error: null,
  message: null,
};

export const userStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(UserApi);

    function isBrowser() {
      return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    function saveToStorage(data: LoginResponse) {
      try {
        if (!isBrowser()) return;
        // Persist only when tokens are present (logged in)
        const maybeToken = (data as any)?.accessToken;
        if (maybeToken) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
        }
      } catch { /* ignore */ }
    }

    function clearStorage() {
      try { if (isBrowser()) localStorage.removeItem(AUTH_STORAGE_KEY); } catch { /* ignore */ }
    }

    function readFromStorage(): LoginResponse | null {
      try {
        if (!isBrowser()) return null;
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.accessToken) {
          return parsed as LoginResponse;
        }
        return null;
      } catch {
        return null;
      }
    }

    return {
      hydrateFromStorage() {
        const existing = readFromStorage();
        if (existing) {
          patchState(store, { auth: existing, loggedIn: true });
        } else {
          patchState(store, { auth: null, loggedIn: false });
        }
      },
      logout() {
        clearStorage();
        patchState(store, { auth: null, loggedIn: false });
      },
      resetForm() {
        patchState(store, { current: null, error: null, message: null });
      },
      async loadRoles() {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.findRoles();
        if ((response as any)?.success) {
          const payload = response as SuccessApiResponse<{ elements: RoleView[] }>;
          const roles = (payload.data?.content as any)?.elements ?? [];
          patchState(store, { roles, loading: false, message: payload.message ?? 'users.roles.loaded' });
          return roles;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payload.reason ?? 'users.roles.error' });
          return [];
        }
      },
      async findById(id: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.findById(id);
        if ((response as any)?.success) {
          const payload = response as SuccessApiResponse<UserView>;
          const user = payload.data?.content as any as UserView;
          patchState(store, { current: user, loading: false, message: payload.message ?? 'users.find.success' });
          return user;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payload.reason ?? 'users.find.error' });
          return null;
        }
      },
      async findByEmail(email: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.findByEmail(email);
        if ((response as any)?.success) {
          const payload = response as SuccessApiResponse<UserView>;
          const user = payload.data?.content as any as UserView;
          patchState(store, { current: user, loading: false, message: payload.message ?? 'users.find.email.success' });
          return user;
        } else {
          const payload = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payload.reason ?? 'users.find.email.error' });
          return null;
        }
      },
      async create(payload: Partial<UserView>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.create(payload);
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<UserView>;
          const user = payloadResp.data?.content as any as UserView;
          patchState(store, { current: user, loading: false, message: payloadResp.message ?? 'users.create.success' });
          return user;
        } else {
          const payloadErr = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payloadErr.reason ?? 'users.create.error' });
          return null;
        }
      },
      async update(id: string, payload: Partial<UserView>) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.update(id, payload);
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<UserView>;
          const user = payloadResp.data?.content as any as UserView;
          patchState(store, { current: user, loading: false, message: payloadResp.message ?? 'users.update.success' });
          return user;
        } else {
          const payloadErr = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payloadErr.reason ?? 'users.update.error' });
          return null;
        }
      },
      async register(payload: RegisterUserRequest) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.register(payload);
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<void>;
          patchState(store, { loading: false, message: payloadResp.message ?? 'users.registerEmailLinkSent' });
          return true;
        } else {
          const payloadErr = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payloadErr.reason ?? 'users.register.error' });
          return false;
        }
      },
      async createPassword(id: string, verificationCode: string, payload: CreateUserPasswordRequest) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.createPassword(id, verificationCode, payload);
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<void>;
          patchState(store, { loading: false, message: payloadResp.message ?? 'users.password.create.success' });
          return true;
        } else {
          const payloadErr = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payloadErr.reason ?? 'users.password.create.error' });
          return false;
        }
      },
      async search(params: { page?: number; size?: number; sortField?: string; sortDirection?: 'ASC' | 'DESC'; nameFilter?: string; emailFilter?: string; phoneFilter?: string; roleNameFilter?: string; }) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.search(params);
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<Page<UserView>>;
          const page = payloadResp.data?.content as any as Page<UserView>;
          patchState(store, { loading: false, message: payloadResp.message ?? 'users.search.success' });
          return page;
        } else {
          const payloadErr = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payloadErr.reason ?? 'users.search.error' });
          return { elements: [], page: 0, size: 0, totalElements: 0, totalPages: 0, isFirst: true, isLast: true } as Page<UserView>;
        }
      },
      async login(payload: LoginApiRequest) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.login(payload);
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<LoginResponse>;
          const result = payloadResp.data?.content as any as LoginResponse;
          const isLoggedIn = !!(result as any)?.accessToken;
          if (isLoggedIn) {
            saveToStorage(result);
          } else {
            // no tokens yet (MFA pending); ensure storage is empty
            clearStorage();
          }
          patchState(store, { auth: result, loggedIn: isLoggedIn, loading: false, message: payloadResp.message ?? 'users.login.success' });
          return result;
        } else {
          const payloadErr = response as ErrorApiResponse;
          clearStorage();
          patchState(store, { auth: null, loggedIn: false, loading: false, error: payloadErr.reason ?? 'users.login.error' });
          return null;
        }
      },
      async verifyMfaCode(email: string, code: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.verifyMfaCode({ email, code });
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<LoginResponse>;
          const result = payloadResp.data?.content as any as LoginResponse;
          const isLoggedIn = !!(result as any)?.accessToken;
          if (isLoggedIn) {
            saveToStorage(result);
          } else {
            clearStorage();
          }
          patchState(store, { auth: result, loggedIn: isLoggedIn, loading: false, message: payloadResp.message ?? 'users.mfa.verify.success' });
          return result;
        } else {
          const payloadErr = response as ErrorApiResponse;
          clearStorage();
          patchState(store, { auth: null, loggedIn: false, loading: false, error: payloadErr.reason ?? 'users.mfa.verify.error' });
          return null;
        }
      },
      async activateAccount(id: string, code: string) {
        patchState(store, { loading: true, error: null, message: null });
        const response = await api.activateAccount(id, code);
        if ((response as any)?.success) {
          const payloadResp = response as SuccessApiResponse<void>;
          patchState(store, { loading: false, message: payloadResp.message ?? 'users.activate.success' });
          return true;
        } else {
          const payloadErr = response as ErrorApiResponse;
          patchState(store, { loading: false, error: payloadErr.reason ?? 'users.activate.error' });
          return false;
        }
      },
    };
  })
);
