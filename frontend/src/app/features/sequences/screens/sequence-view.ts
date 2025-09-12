import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { sequencesStore } from '../sequences.store';

@Component({
  selector: 'app-sequence-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent],
  template: `
    <app-action-bar [showCancel]="false" [showSave]="false" (newClicked)="goNew()" (editClicked)="goEdit()" />

    <div class="p-4 space-y-4">
      <app-card>
        <div class="flex items-start gap-4 md:gap-6">
          <div class="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <span class="material-symbols-outlined text-neutral-600 dark:text-neutral-300 text-3xl">123</span>
          </div>
          <div class="flex-1 space-y-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div class="text-2xl font-semibold leading-tight">{{ name() || '-' }}</div>
                <div class="text-sm text-muted">{{ code() }}</div>
              </div>
              <div class="flex items-center gap-2"></div>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Préfixe</div>
                <div class="text-base">{{ prefix() || '—' }}</div>
              </div>
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Suffixe</div>
                <div class="text-base">{{ suffix() || '—' }}</div>
              </div>
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Actif</div>
                <div class="text-base">{{ active() ? 'Oui' : 'Non' }}</div>
              </div>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Pas</div>
                <div class="text-base">{{ step() }}</div>
              </div>
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Taille</div>
                <div class="text-base">{{ size() }}</div>
              </div>
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Prochain</div>
                <div class="text-base">{{ next() }}</div>
              </div>
            </div>
          </div>
        </div>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class SequenceViewPage {
  readonly store = inject(sequencesStore);
  readonly router = inject(Router);

  id = computed(() => this.store.current()?.id ?? '');
  code = computed(() => this.store.current()?.code ?? '');
  name = computed(() => this.store.current()?.name ?? '');
  prefix = computed(() => this.store.current()?.prefix ?? '');
  suffix = computed(() => this.store.current()?.suffix ?? '');
  active = computed(() => this.store.current()?.active ?? false);
  step = computed(() => this.store.current()?.step ?? 0);
  size = computed(() => this.store.current()?.size ?? 0);
  next = computed(() => this.store.current()?.next ?? '');

  goNew() {
    this.router.navigate(['/sequences', 'new']);
  }
  goEdit() {
    this.router.navigate(['/sequences', this.id(), 'edit']);
  }
}
