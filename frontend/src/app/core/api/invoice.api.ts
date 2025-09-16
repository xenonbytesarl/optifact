import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GlobalApi } from './global.api';
import { ErrorApiResponse, Page, SuccessApiResponse } from '../model/response.model';
import { Direction } from '../model/direction.enum';
import { parseApiDate } from '../utils/date.util';

export type InvoiceState = 'DRAFT' | 'VALIDATE' | 'PAID' | 'CANCEL';

export interface BankAccount {
  bankAccountOwner: string;
  bankName: string;
  bankCode: string;
  bankCounter: string;
  bankAccountNumber: string;
  bankAccountKey: string;
}

export interface InvoiceLine {
  id?: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: string; // decimal as string
  unitPriceCurrency?: string | null;
  amount?: string | null; // decimal as string
  amountCurrency?: string | null;
}

export interface Invoice {
  id?: string;
  createdAt?: Date | null;
  reference?: string | null;
  sendAt?: Date | null;
  actorId: string;
  issueAt?: Date | null;
  amount?: string | null; // decimal as string
  amountCurrency?: string | null;
  claimId?: string | null;
  bankAccount?: BankAccount | null;
  state: InvoiceState;
  lines: InvoiceLine[];
}

export type InvoiceSortColumn = 'createdAt' | 'reference' | 'state';

@Injectable({ providedIn: 'root' })
export class InvoiceApi extends GlobalApi {
  private base = this.apiUrl + '/invoices';

  private mapInvoice(i: any): Invoice {
    if (!i) return i as Invoice;
    return {
      ...i,
      createdAt: parseApiDate(i.createdAt),
      sendAt: parseApiDate(i.sendAt),
      issueAt: parseApiDate(i.issueAt),
    } as Invoice;
  }

  private mapPageInvoices(p: any): any {
    if (!p) return p;
    const elements = Array.isArray(p.elements) ? p.elements.map((e: any) => this.mapInvoice(e)) : p.elements;
    return { ...p, elements };
  }

  async search(
    referenceFilter: string,
    actorNameFilter: string,
    claimNameFilter: string,
    stateFilter: string,
    page: number,
    size: number,
    sort: InvoiceSortColumn,
    direction: Direction
  ) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sort)
      .set('sortDirection', direction);
    if (referenceFilter) params = params.set('referenceFilter', referenceFilter);
    if (actorNameFilter) params = params.set('actorName', actorNameFilter);
    if (claimNameFilter) params = params.set('claimName', claimNameFilter);
    if (stateFilter) params = params.set('stateFilter', stateFilter);
    try {
      const res = await firstValueFrom(this.http.get<SuccessApiResponse<Page<Invoice> | ErrorApiResponse>>(this.base, { params }));
      if ((res as any)?.success) {
        const page = (res as any).data?.content as any;
        const mapped = this.mapPageInvoices(page);
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
      const res = await firstValueFrom(this.http.get<SuccessApiResponse<Invoice | ErrorApiResponse>>(`${this.base}/${id}`));
      if ((res as any)?.success) {
        const invoice = (res as any).data?.content as any;
        const mapped = this.mapInvoice(invoice);
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

  async create(payload: Partial<Invoice>) {
    try {
      const res = await firstValueFrom(this.http.post<SuccessApiResponse<Invoice | ErrorApiResponse>>(this.base, payload));
      if ((res as any)?.success) {
        const invoice = (res as any).data?.content as any;
        const mapped = this.mapInvoice(invoice);
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

  async update(id: string, payload: Partial<Invoice>) {
    try {
      const res = await firstValueFrom(this.http.put<SuccessApiResponse<Invoice | ErrorApiResponse>>(`${this.base}/${id}`, payload));
      if ((res as any)?.success) {
        const invoice = (res as any).data?.content as any;
        const mapped = this.mapInvoice(invoice);
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
}
