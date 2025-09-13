import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GlobalHttpApi } from './global-http-repository.service';
import { ErrorApiResponse, Page, SuccessApiResponse } from '../model/response.model';
import {Direction} from '../model/direction.enum';

export type ClaimState = 'DRAFT' | 'SUBMITTED' | 'IN_INSTRUCTION' | 'REJECTED' | 'VALIDATED' | 'DONE' | 'CANCELLED';
export type ClaimLineStatus = 'DRAFT' | 'VALIDATED' | 'REJECTED' | 'CANCELLED';
export type AttachmentScope = 'EXTERNAL' | 'INTERNAL';

export interface Attachment {
  id?: string;
  filename?: string | null;
  mimeType?: string | null;
  attachmentTypeId: string;
  createdAt?: string | null;
  createdBy?: string | null;
  scope?: AttachmentScope | null;
  resourceId?: string | null;
  resourceName?: string | null;
}

export interface ClaimLine {
  id?: string;
  attachmentId?: string | null;
  createdAt?: string | null;
  validateAt?: string | null;
  rejectedAt?: string | null;
  cancelledAt?: string | null;
  status: ClaimLineStatus;
  reason?: string | null;
  claimId?: string | null;
}

export interface Claim {
  id?: string;
  actorId?: string | null;
  actorName?: string | null;
  productId?: string | null;
  productName?: string | null;
  createdAt?: Date | null;
  submitAt?: Date | null;
  managerId?: string | null;
  inInstructionAt?: Date | null;
  instructorId?: string | null;
  validateAt?: Date | null;
  validatorId?: string | null;
  doneAt?: Date | null;
  doneId?: string | null;
  cancelAt?: Date | null;
  cancelId?: string | null;
  state: ClaimState;
  reference?: string | null;
  lines: ClaimLine[];
}

export type ClaimSortColumn = 'reference' | 'createdAt' | 'state';

@Injectable({ providedIn: 'root' })
export class ClaimApi extends GlobalHttpApi {
  private base = this.apiUrl + '/claims';

  async search(
    referenceFilter: string,
    stateFilter: string,
    actorNameFilter: string,
    productNameFilter: string,
    page: number,
    size: number,
    sort: ClaimSortColumn,
    direction: Direction) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction);
    if (referenceFilter) params = params.set('referenceFilter', referenceFilter);
    if (stateFilter) params = params.set('stateFilter', stateFilter);
    if (actorNameFilter) params = params.set('actorNameFilter', actorNameFilter);
    if (productNameFilter) params = params.set('productNameFilter', productNameFilter);
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Page<Claim> | ErrorApiResponse>>(this.base, { params }));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async get(id: string) {
    try {
      return await firstValueFrom(this.http.get<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${id}`));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async create(payload: Partial<Claim>) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(this.base, payload));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<Claim>) {
    try {
      return await firstValueFrom(this.http.put<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${id}`, payload));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await firstValueFrom(this.http.delete<SuccessApiResponse<void | ErrorApiResponse>>(`${this.base}/${id}`));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }
}
