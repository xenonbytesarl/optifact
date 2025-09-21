import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GlobalApi } from './global.api';
import { ErrorApiResponse, SuccessApiResponse } from '../model/response.model';

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

@Injectable({ providedIn: 'root' })
export class UserApi extends GlobalApi {

  private base = this.apiUrl + '/users';


  async create(payload: Partial<UserView>) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<UserView | ErrorApiResponse>>(this.base, payload)
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
        this.http.get<SuccessApiResponse<UserView | ErrorApiResponse>>(`${this.base}/${id}`)
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
        this.http.get<SuccessApiResponse<UserView | ErrorApiResponse>>(`${this.base}/email/${encodeURIComponent(email)}`)
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
        this.http.get<SuccessApiResponse<{ elements: RoleView[] } | ErrorApiResponse>>(`${this.base}/roles`)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }
}
