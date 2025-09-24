import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GlobalApi } from './global.api';
import { ErrorApiResponse, Page, SuccessApiResponse } from '../model/response.model';

export interface PrivilegeView {
  id: string;
  name: string;
}

export interface RoleView {
  id: string;
  code: string;
  name: string;
  privileges?: PrivilegeView[];
}

export interface UserView {
  id?: string;
  firstname?: string | null;
  lastname: string;
  email: string;
  phone?: string | null;
  accountEnabled?: boolean;
  accountLocked?: boolean;
  accountExpired?: boolean;
  credentialExpired?: boolean;
  mfaEnabled?: boolean;
  totalLoginAttempt?: number;
  actorId?: string | null;
  roles: RoleView[];
}

export interface RegisterUserRequest {
  firstname?: string | null;
  lastname: string;
  email: string;
  phone?: string | null;
  actorName?: string | null;
  registrationNumber?: string | null;
  taxNumber?: string | null;
}

export interface CreateUserPasswordRequest {
  password: string;
  confirmPassword?: string;
}

export interface LoginApiRequest {
  email: string;
  password: string;
}

export interface LoginPendingResponse {
  email: string;
  mfaEnable: boolean;
}

export interface LoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = LoginPendingResponse | LoginSuccessResponse;

@Injectable({ providedIn: 'root' })
export class UserApi extends GlobalApi {

  private base = this.apiUrl + '/users';

  async create(payload: Partial<UserView>) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<UserView | ErrorApiResponse>>(this.base, payload, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<UserView>) {
    try {
      return await firstValueFrom(
        this.http.put<SuccessApiResponse<UserView | ErrorApiResponse>>(`${this.base}/${id}`, payload, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async register(payload: RegisterUserRequest) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<void> | ErrorApiResponse>(`${this.base}/auth/register`, payload, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async createPassword(id: string, verificationCode: string, payload: CreateUserPasswordRequest) {
    try {
      const confirm = payload.confirmPassword ?? payload.password;
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<void> | ErrorApiResponse>(`${this.base}/auth/${id}/password/${encodeURIComponent(verificationCode)}`,
          { password: payload.password, confirmPassword: confirm }, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async activateAccount(id: string, code: string) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<void> | ErrorApiResponse>(`${this.base}/auth/${id}/activate/${encodeURIComponent(code)}`,
          {}, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async search(params: {
    page?: number; size?: number; sortField?: string; sortDirection?: 'ASC' | 'DESC';
    nameFilter?: string; emailFilter?: string; phoneFilter?: string; roleNameFilter?: string;
  }) {
    try {
      let httpParams = new HttpParams();
      Object.entries(params || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null && `${v}`.length > 0) {
          httpParams = httpParams.set(k, `${v}`);
        }
      });
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<Page<UserView>> | ErrorApiResponse>(`${this.base}`, { params: httpParams, headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async findById(id: string) {
    try {
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<UserView | ErrorApiResponse>>(`${this.base}/${id}`, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async findByEmail(email: string) {
    try {
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<UserView | ErrorApiResponse>>(`${this.base}/email/${encodeURIComponent(email)}`, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async findRoles() {
    try {
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<{ elements: RoleView[] } | ErrorApiResponse>>(`${this.base}/roles`, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async login(payload: LoginApiRequest) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<LoginResponse> | ErrorApiResponse>(`${this.base}/auth/login`, payload, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async verifyMfaCode(payload: { email: string; code: string }) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<LoginResponse> | ErrorApiResponse>(`${this.base}/auth/mfa/verify`, payload, { headers: this.headers })
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }
}
