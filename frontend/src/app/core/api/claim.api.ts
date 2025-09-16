import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GlobalApi } from './global.api';
import { ErrorApiResponse, Page, SuccessApiResponse } from '../model/response.model';
import {Direction} from '../model/direction.enum';
import { parseApiDate } from '../utils/date.util';
import {response} from 'express';

export type ClaimState = 'DRAFT' | 'SUBMITTED' | 'IN_INSTRUCTION' | 'REJECTED' | 'VALIDATED' | 'DONE' | 'CANCELLED';
export type ClaimLineStatus = 'DRAFT' | 'UPLOADED' | 'VALIDATED' | 'REJECTED' | 'CANCELLED';
export type AttachmentScope = 'EXTERNAL' | 'INTERNAL';

export type ClaimSortColumn = 'reference' | 'createdAt' | 'state';

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
  attachmentTypeName?: string | null;
  createdAt?: string | null;
  uploadedAt?: string | null;
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
  rejectedAt: Date | null;
  managerId?: string | null;
  inInstructionAt?: Date | null;
  instructorId?: string | null;
  validateAt?: Date | null;
  validatorId?: string | null;
  doneAt?: Date | null;
  doneId?: string | null;
  cancelAt?: Date | null;
  cancelId?: string | null;
  uploadStarted: boolean | null;
  uploadEnded: boolean | null;
  state: ClaimState;
  reference?: string | null;
  lines: ClaimLine[];
}

export interface AttachmentTransfert {
  claimId: string;
  claimLine: ClaimLine;
  files: File[];
}

export interface AttachementDownload {
  success: boolean;
  blob: Blob;
  filename: string;
}



@Injectable({ providedIn: 'root' })
export class ClaimApi extends GlobalApi {
  private base = this.apiUrl + '/claims';

  private mapClaim(c: any): Claim {
    if (!c) return c as Claim;
    return {
      ...c,
      createdAt: parseApiDate(c.createdAt),
      submitAt: parseApiDate(c.submitAt),
      inInstructionAt: parseApiDate(c.inInstructionAt),
      validateAt: parseApiDate(c.validateAt),
      doneAt: parseApiDate(c.doneAt),
      cancelAt: parseApiDate(c.cancelAt),
    } as Claim;
  }

  private mapPageClaims(p: any): any {
    if (!p) return p;
    const elements = Array.isArray(p.elements) ? p.elements.map((e: any) => this.mapClaim(e)) : p.elements;
    return { ...p, elements };
  }

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
      const res = await firstValueFrom(this.http.get<SuccessApiResponse<Page<Claim> | ErrorApiResponse>>(this.base, { params }));
      if ((res as any)?.success) {
        const page = (res as any).data?.content as any;
        const mapped = this.mapPageClaims(page);
        return { ...(res as any), data: { ...(res as any).data, content: mapped } } as any;
      }
      return res as any;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async get(id: string) {
    try {
      const res = await firstValueFrom(this.http.get<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${id}`));
      if ((res as any)?.success) {
        const claim = (res as any).data?.content as any;
        const mapped = this.mapClaim(claim);
        return { ...(res as any), data: { ...(res as any).data, content: mapped } } as any;
      }
      return res as any;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async create(payload: Partial<Claim>) {
    try {
      const res = await firstValueFrom(this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(this.base, payload));
      if ((res as any)?.success) {
        const claim = (res as any).data?.content as any;
        const mapped = this.mapClaim(claim);
        return { ...(res as any), data: { ...(res as any).data, content: mapped } } as any;
      }
      return res as any;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async update(id: string, payload: Partial<Claim>) {
    try {
      const res = await firstValueFrom(this.http.put<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${id}`, payload));
      if ((res as any)?.success) {
        const claim = (res as any).data?.content as any;
        const mapped = this.mapClaim(claim);
        return { ...(res as any), data: { ...(res as any).data, content: mapped } } as any;
      }
      return res as any;
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

  async transfertAttachment(attachmentTransfert: AttachmentTransfert) {
    try {
      const formData = new FormData();
      if (attachmentTransfert.files.length > 0) {
        formData.append('file', attachmentTransfert.files[0]);
      }
      const claimId = attachmentTransfert.claimId;
      const lineId = attachmentTransfert.claimLine.id;
      const attachmentId = attachmentTransfert.claimLine.attachmentId;
      return await firstValueFrom(this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${claimId}/claim-lines/${lineId}/attachments/${attachmentId}/transfert`, formData));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  transfertAttachmentWithProgress(attachmentTransfert: AttachmentTransfert) {
    const formData = new FormData();
    if (attachmentTransfert.files.length > 0) {
      formData.append('file', attachmentTransfert.files[0]);
    }
    const claimId = attachmentTransfert.claimId;
    const lineId = attachmentTransfert.claimLine.id;
    const attachmentId = attachmentTransfert.claimLine.attachmentId;
    return this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(
      `${this.base}/${claimId}/claim-lines/${lineId}/attachments/${attachmentId}/transfert`,
      formData,
      { reportProgress: true, observe: 'events' as const }
    );
  }

  async downloadAttachment(claimId: string, attachmentId: string) {
    try {
      // Return the raw HttpResponse<Blob> so callers can extract filename and trigger browser download
      const response: HttpResponse<Blob> =  await firstValueFrom(
        this.http.get(`${this.base}/${claimId}/attachments/${attachmentId}/download`, {
          responseType: 'blob' as const,
          observe: 'response' as const
        })
      );

      let filename = this.getFilename(response);

      return {  blob: response.body as Blob, filename, success: true } as AttachementDownload;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async validateClaimLine(claimId: string, lineId: string) {
    try {
      return await firstValueFrom(
        this.http.put<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${claimId}/claim-lines/${lineId}/validate`, {})
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async rejectClaimLine(claimId: string, lineId: string, reason: string) {
    try {
      return await firstValueFrom(
        this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${claimId}/claim-lines/${lineId}/reject`, { reason }));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async submitClaim(claimId: string) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${claimId}/submit`, {}));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async toInstruction(claimId: string) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${claimId}/instruction`, {}));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  async doneInstruction(claimId: string) {
    try {
      return await firstValueFrom(this.http.post<SuccessApiResponse<Claim | ErrorApiResponse>>(`${this.base}/${claimId}/done-instruction`, {}));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error as ErrorApiResponse;
      }
      return this.createErrorResponse(error);
    }
  }

  private getFilename(response: HttpResponse<Blob>) {
    let filename = '';
    const disposition = response.headers.get('Content-Disposition') || '';
    // RFC 5987/6266 filename parsing: support filename* (UTF-8) and quoted filename
    const matchQuoted = /filename="([^\"]+)"/i.exec(disposition);
    const matchStar = /filename\*=(?:UTF-8''|)([^;\s]+)/i.exec(disposition);
    if (matchQuoted && matchQuoted[1]) {
      filename = matchQuoted[1];
    } else if (matchStar && matchStar[1]) {
      try {
        filename = decodeURIComponent(matchStar[1]);
      } catch {
        filename = matchStar[1];
      }
    }
    return filename;
  }
}
