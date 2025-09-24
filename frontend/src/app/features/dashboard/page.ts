import { Component, inject, computed } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ButtonComponent } from '../../shared/ui/button';
import { IconComponent } from '../../shared/ui/icon';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { provideDashboardStore, DashboardStore } from './dashboard.store';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  providers: [provideDashboardStore()],
  imports: [PageHeaderComponent, ButtonComponent, IconComponent, TranslatePipe],
  template: `
    <div class="p-4 space-y-6">
      <app-page-header [title]="('dashboard.title' | t)">
        <div actions>
          <app-button variant="ghost" (click)="reload()">
            <app-icon name="refresh"></app-icon>
            {{ 'dashboard.refresh' | t }}
          </app-button>
        </div>
      </app-page-header>

      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl bg-white/70 dark:bg-gray-800/70 shadow p-4 border border-gray-200/70 dark:border-gray-700/60">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">{{ 'dashboard.kpi.inInstruction' | t }}</div>
              <div class="text-3xl font-semibold text-blue-600 dark:text-blue-400">{{ store.kpis().inInstruction }}</div>
            </div>
            <span class="material-symbols-outlined text-blue-500 text-4xl">assignment</span>
          </div>
        </div>
        <div class="rounded-xl bg-white/70 dark:bg-gray-800/70 shadow p-4 border border-gray-200/70 dark:border-gray-700/60">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">{{ 'dashboard.kpi.granted' | t }}</div>
              <div class="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">{{ store.kpis().granted }}</div>
            </div>
            <span class="material-symbols-outlined text-emerald-500 text-4xl">verified</span>
          </div>
        </div>
        <div class="rounded-xl bg-white/70 dark:bg-gray-800/70 shadow p-4 border border-gray-200/70 dark:border-gray-700/60">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">{{ 'dashboard.kpi.refused' | t }}</div>
              <div class="text-3xl font-semibold text-rose-600 dark:text-rose-400">{{ store.kpis().refused }}</div>
            </div>
            <span class="material-symbols-outlined text-rose-500 text-4xl">block</span>
          </div>
        </div>
        <div class="rounded-xl bg-white/70 dark:bg-gray-800/70 shadow p-4 border border-gray-200/70 dark:border-gray-700/60">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">{{ 'dashboard.kpi.adjourned' | t }}</div>
              <div class="text-3xl font-semibold text-amber-600 dark:text-amber-400">{{ store.kpis().adjourned }}</div>
            </div>
            <span class="material-symbols-outlined text-amber-500 text-4xl">schedule</span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="xl:col-span-1 rounded-xl bg-white/70 dark:bg-gray-800/70 shadow p-6 border border-gray-200/70 dark:border-gray-700/60">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ 'dashboard.charts.decisions' | t }}</h3>
          </div>
          <!-- Stacked bar for decisions -->
          <div class="mt-2">
            <div class="h-4 w-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex">
              <div class="h-full" [style.width.%]="percent('granted')" class="bg-emerald-500"></div>
              <div class="h-full" [style.width.%]="percent('refused')" class="bg-rose-500"></div>
              <div class="h-full" [style.width.%]="percent('adjourned')" class="bg-amber-500"></div>
              <div class="h-full" [style.width.%]="percent('inInstruction')" class="bg-blue-500"></div>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div class="flex items-center gap-2"><span class="inline-block w-3 h-3 rounded-sm bg-emerald-500"></span><span>{{ 'claims.states.agreement_granted' | t }}</span><span class="ml-auto font-medium">{{ store.kpis().granted }}</span></div>
              <div class="flex items-center gap-2"><span class="inline-block w-3 h-3 rounded-sm bg-rose-500"></span><span>{{ 'claims.states.agreement_refused' | t }}</span><span class="ml-auto font-medium">{{ store.kpis().refused }}</span></div>
              <div class="flex items-center gap-2"><span class="inline-block w-3 h-3 rounded-sm bg-amber-500"></span><span>{{ 'claims.states.agreement_adjourned' | t }}</span><span class="ml-auto font-medium">{{ store.kpis().adjourned }}</span></div>
              <div class="flex items-center gap-2"><span class="inline-block w-3 h-3 rounded-sm bg-blue-500"></span><span>{{ 'claims.states.in_instruction' | t }}</span><span class="ml-auto font-medium">{{ store.kpis().inInstruction }}</span></div>
            </div>
          </div>
        </div>

        <div class="xl:col-span-2 rounded-xl bg-white/70 dark:bg-gray-800/70 shadow p-6 border border-gray-200/70 dark:border-gray-700/60">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ 'dashboard.charts.monthlyInvoiced' | t }}</h3>
          </div>
          <!-- Simple bar chart -->
          <div class="relative mt-2">
            <div class="h-64 flex items-end gap-2">
              @for (p of store.monthlyInvoiced(); track p.label) {
                <div class="flex-1 flex flex-col items-center gap-1">
                  <div class="w-full bg-blue-500/20 dark:bg-blue-400/20 rounded-t-md" [style.height.%]="barHeight(p.amount)">
                    <div class="w-full bg-blue-500 dark:bg-blue-400 rounded-t-md" [style.height.%]="barFill(p.amount)"></div>
                  </div>
                  <div class="text-[10px] text-gray-500">{{ p.label }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices by status with amounts -->
      <div class="rounded-xl bg-white/70 dark:bg-gray-800/70 shadow p-6 border border-gray-200/70 dark:border-gray-700/60">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ 'dashboard.charts.invoicesByStatus' | t }}</h3>
        </div>
        <div class="space-y-3">
          @for (s of store.invoiceAmountsByStatus(); track s.state) {
            <div class="flex items-center gap-3">
              <div class="w-28 text-xs text-gray-600 dark:text-gray-300">
                @switch (s.state) {
                  @case ('DRAFT') { <span>{{ 'invoices.states.draft' | t }}</span> }
                  @case ('VALIDATE') { <span>{{ 'invoices.states.validate' | t }}</span> }
                  @case ('PAID') { <span>{{ 'invoices.states.paid' | t }}</span> }
                  @case ('CANCEL') { <span>{{ 'invoices.states.cancel' | t }}</span> }
                }
              </div>
              <div class="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div class="h-full" [style.width.%]="statusBarFill(s.amount)" [style.backgroundColor]="statusColor(s.state)"></div>
              </div>
              <div class="w-28 text-right text-xs font-medium tabular-nums">{{ formatAmount(s.amount) }}</div>
            </div>
          }
        </div>
      </div>

      @if (store.loading()) {
        <div class="flex items-center gap-2 text-sm text-gray-500"><app-icon name="progress_activity"></app-icon> {{ 'dashboard.loading' | t }}</div>
      }
      @if (store.error()) {
        <div class="text-sm text-rose-600">{{ store.error() }}</div>
      }
    </div>
  `
})
export class DashboardPage {
  readonly store = inject(DashboardStore);

  constructor() {
    this.store.load();
  }

  reload() { this.store.load(); }

  // Compute percent for stacked bar
  percent(key: 'inInstruction' | 'adjourned' | 'granted' | 'refused'): number {
    const k = this.store.kpis();
    const total = k.inInstruction + k.adjourned + k.granted + k.refused;
    if (!total) return 0;
    return Math.round(((k as any)[key] / total) * 100);
  }

  // Bars heights relative to max
  private maxAmount = computed(() => Math.max(1, ...this.store.monthlyInvoiced().map(p => p.amount)));

  barHeight(val: number): number { // overall container percent
    const max = this.maxAmount();
    return 100; // container always 100%
  }

  barFill(val: number): number { // inner fill percent of container
    const max = this.maxAmount();
    return Math.round((val / max) * 100);
  }

  // Invoices by status helpers
  private maxStatusAmount = computed(() => Math.max(1, ...this.store.invoiceAmountsByStatus().map(s => s.amount)));

  statusBarFill(val: number): number {
    const max = this.maxStatusAmount();
    return Math.round((val / max) * 100);
  }

  statusColor(state: 'DRAFT' | 'VALIDATE' | 'PAID' | 'CANCEL'): string {
    switch (state) {
      case 'DRAFT': return '#9ca3af'; // gray-400
      case 'VALIDATE': return '#3b82f6'; // blue-500
      case 'PAID': return '#10b981'; // emerald-500
      case 'CANCEL': return '#ef4444'; // red-500
      default: return '#6b7280';
    }
  }

  formatAmount(val: number): string {
    try {
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val || 0);
    } catch {
      return String(Math.round(val || 0));
    }
  }
}
