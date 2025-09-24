import { inject, signal, computed } from '@angular/core';
import { ClaimApi, ClaimState } from '../../core/api/claim.api';
import { InvoiceApi, Invoice, InvoiceState } from '../../core/api/invoice.api';
import { Direction } from '../../core/model/direction.enum';

export interface DashboardKpis {
  inInstruction: number;
  adjourned: number;
  granted: number;
  refused: number;
}

export interface MonthlyAmountPoint {
  label: string; // e.g., 2025-01
  month: number; // 1..12
  year: number;
  amount: number; // numeric value (assumed same currency)
}

export interface InvoiceAmountByStatus {
  state: InvoiceState;
  amount: number;
  count: number;
}

export class DashboardStore {
  private claimApi = inject(ClaimApi);
  private invoiceApi = inject(InvoiceApi);

  loading = signal(false);
  error = signal<string | null>(null);

  // KPIs
  kpis = signal<DashboardKpis>({ inInstruction: 0, adjourned: 0, granted: 0, refused: 0 });

  // Charts data
  decisionsChart = computed(() => {
    const k = this.kpis();
    return [
      { key: 'inInstruction', labelKey: 'claims.states.in_instruction', value: k.inInstruction, color: '#60a5fa' },
      { key: 'granted', labelKey: 'claims.states.agreement_granted', value: k.granted, color: '#34d399' },
      { key: 'refused', labelKey: 'claims.states.agreement_refused', value: k.refused, color: '#f87171' },
      { key: 'adjourned', labelKey: 'claims.states.agreement_adjourned', value: k.adjourned, color: '#fbbf24' }
    ];
  });

  monthlyInvoiced = signal<MonthlyAmountPoint[]>([]);
  invoiceAmountsByStatus = signal<InvoiceAmountByStatus[]>([]);

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      // Fetch claim KPIs by calling the search endpoint with stateFilter and get total elements
      const inInstruction = await this.fetchClaimCount('IN_INSTRUCTION');
      const adjourned = await this.fetchClaimCount('AGREEMENT_ADJOURNED');
      const granted = await this.fetchClaimCount('AGREEMENT_GRANTED');
      const refused = await this.fetchClaimCount('AGREEMENT_REFUSED');
      this.kpis.set({ inInstruction, adjourned, granted, refused });

      // Fetch invoices and compute amount per month over last 12 months
      const series = await this.computeMonthlyInvoiced(12);
      this.monthlyInvoiced.set(series);

      // Compute amounts by status
      const byStatus = await this.computeInvoiceAmountsByStatus();
      this.invoiceAmountsByStatus.set(byStatus);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Erreur de chargement du tableau de bord');
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchClaimCount(state: ClaimState): Promise<number> {
    // We query first page with small size just to get the total count returned by backend page
    const res: any = await this.claimApi.search('', state, '', '', 0, 1, 'createdAt', Direction.DESC);
    if (!res?.success) return 0;
    const page = res.data?.content;
    // The Page model usually contains totalElements; fallback to elements length
    return page?.totalElements ?? page?.elements?.length ?? 0;
  }

  private async computeMonthlyInvoiced(monthsBack: number): Promise<MonthlyAmountPoint[]> {
    // Pre-build buckets for the last N months so the chart never appears empty
    const now = new Date();
    const buckets = new Map<string, MonthlyAmountPoint>();
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(key, { label: key, month: d.getMonth() + 1, year: d.getFullYear(), amount: 0 });
    }

    // Request a larger page to cover recent invoices (500)
    const res: any = await this.invoiceApi.search('', '', '', '', 0, 500, 'createdAt', Direction.DESC);
    if (!res?.success) return Array.from(buckets.values());

    const page = res.data?.content;
    const items: Invoice[] = page?.elements ?? [];

    const normalize = (val: any): number => {
      if (val == null) return NaN;
      if (typeof val === 'number') return val;
      const s = String(val).replace(/\s/g, '').replace(',', '.');
      const n = parseFloat(s);
      return isNaN(n) ? NaN : n;
    };

    // Aggregate per YYYY-MM over the last N months
    for (const inv of items) {
      const date = (inv.issueAt as any as Date) || (inv.sendAt as any as Date) || (inv.createdAt as any as Date) || null;
      if (!date) continue;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!buckets.has(key)) continue;

      // Prefer invoice total amount; fallback to sum of line amounts when absent or zero
      let amt = normalize((inv as any).amount);
      if (!(amt > 0) && Array.isArray(inv.lines) && inv.lines.length) {
        let sum = 0;
        for (const ln of inv.lines as any[]) {
          const la = normalize((ln as any).amount);
          if (!isNaN(la)) sum += la;
        }
        if (sum > 0) amt = sum;
      }

      if (!isNaN(amt)) {
        buckets.get(key)!.amount += amt;
      }
    }

    return Array.from(buckets.values());
  }

  private async computeInvoiceAmountsByStatus(): Promise<InvoiceAmountByStatus[]> {
    const order: InvoiceState[] = ['DRAFT', 'VALIDATE', 'PAID', 'CANCEL'];
    const map = new Map<InvoiceState, InvoiceAmountByStatus>();
    for (const st of order) {
      map.set(st, { state: st, amount: 0, count: 0 });
    }

    const res: any = await this.invoiceApi.search('', '', '', '', 0, 100, 'createdAt', Direction.DESC);
    if (!res?.success) return Array.from(map.values());

    const page = res.data?.content;
    const items: Invoice[] = page?.elements ?? [];

    const normalize = (val: any): number => {
      if (val == null) return NaN;
      if (typeof val === 'number') return val;
      const s = String(val).replace(/\s/g, '').replace(',', '.');
      const n = parseFloat(s);
      return isNaN(n) ? NaN : n;
    };

    for (const inv of items) {
      const st = inv.state as InvoiceState;
      // Prefer invoice total amount; fallback to sum of line amounts when absent or zero
      let amt = normalize((inv as any).amount);
      if (!(amt > 0) && Array.isArray(inv.lines) && inv.lines.length) {
        let sum = 0;
        for (const ln of inv.lines as any[]) {
          const la = normalize((ln as any).amount);
          if (!isNaN(la)) sum += la;
        }
        if (sum > 0) amt = sum;
      }
      const rec = map.get(st) ?? { state: st, amount: 0, count: 0 };
      if (!isNaN(amt)) rec.amount += amt;
      rec.count += 1;
      map.set(st, rec);
    }

    return order.map(st => map.get(st)!).filter(Boolean);
  }
}

export function provideDashboardStore() {
  return [{ provide: DashboardStore, useClass: DashboardStore }];
}
