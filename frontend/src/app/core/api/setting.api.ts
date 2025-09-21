import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {GlobalApi} from './global.api';
import {ErrorApiResponse, SuccessApiResponse} from '../model/response.model';

export interface Address {
  street?: string | null;
  city?: string | null;
  country?: string | null;
  zipCode?: string | null;
  website?: string | null;
}

export interface Contact {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  function?: string | null;
}

export interface BankAccount {
  bankAccountOwner: string;
  bankName: string;
  bankCode: string;
  bankCounter: string;
  bankAccountNumber: string;
  bankAccountKey: string;
}

export interface Company {
  name: string;
  logoFilename?: string | null;
  presidentId?: string | null; // uuid
  bankAccount?: BankAccount | null;
  address?: Address | null;
  contact?: Contact | null;
}

export enum MailServerType {
  GOOGLE = 'GOOGLE',
  YAHOO = 'YAHOO',
  MICROSOFT = 'MICROSOFT',
  OTHER = 'OTHER'
}

export enum MailServerState {
  NEW = 'NEW',
  CONFIRM = 'CONFIRM',
  WAITING = 'WAITING'
}

export interface EmailServer {
  from?: string | null;
  type?: MailServerType | null;
  host?: string | null;
  port?: number | null;
  protocol?: string | null;
  useTLS?: boolean | null;
  useAuth?: boolean | null;
  username?: string | null;
  // password is not returned by API for security
  state?: MailServerState | null;
  confirmedAt?: string | null; // ISO date-time
}

export interface Setting {
  id: string;
  company: Company;
  emailServer?: EmailServer | null;
}

export type SettingPayload = {
  company: Company;
  emailServer?: EmailServer | null;
}

@Injectable({providedIn: 'root'})
export class SettingApi extends GlobalApi {
  private base = this.apiUrl + '/settings';

  async get(id: string) {
    try {
      return await firstValueFrom(
        this.http.get<SuccessApiResponse<Setting | ErrorApiResponse>>(`${this.base}/${id}`)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: SettingPayload) {
    try {
      return await firstValueFrom(
        this.http.put<SuccessApiResponse<Setting | ErrorApiResponse>>(`${this.base}/${id}`, payload)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }
}
