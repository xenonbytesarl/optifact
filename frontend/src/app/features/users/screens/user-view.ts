import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { userStore } from '../user.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ActionBarComponent, CardComponent],
  template: `
    <app-action-bar [showCancel]="false" [showSave]="false" (newClicked)="createNew()" (editClicked)="editCurrent()" />

    <div class="p-4 space-y-4">
      @if (store.current()) {
        <app-card>
          <div class="flex items-start gap-4 md:gap-6">
            <div class="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <span class="material-symbols-outlined text-neutral-600 dark:text-neutral-300 text-3xl">group</span>
            </div>
            <div class="flex-1 space-y-6">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div class="text-2xl font-semibold leading-tight">{{ (store.current()?.firstname || '') + ' ' + (store.current()?.lastname || '') || '-' }}</div>
                  <div class="text-sm text-muted">{{ store.current()?.email || '-' }}</div>
                </div>
                <div class="flex items-center gap-2"></div>
              </div>

              <div class="grid gap-6 md:grid-cols-3">
                <div class="rounded border border-token p-4 bg-surface/50">
                  <div class="text-xs text-muted mb-1">{{ 'users.fields.firstname' | t }}</div>
                  <div class="text-base">{{ store.current()?.firstname || '—' }}</div>
                </div>
                <div class="rounded border border-token p-4 bg-surface/50">
                  <div class="text-xs text-muted mb-1">{{ 'users.fields.lastname' | t }}</div>
                  <div class="text-base">{{ store.current()?.lastname || '—' }}</div>
                </div>
                <div class="rounded border border-token p-4 bg-surface/50">
                  <div class="text-xs text-muted mb-1">{{ 'users.fields.phone' | t }}</div>
                  <div class="text-base">{{ store.current()?.phone || '—' }}</div>
                </div>
              </div>

              <div class="grid gap-6 md:grid-cols-3">
                <div class="rounded border border-token p-4 bg-surface/50">
                  <div class="text-xs text-muted mb-1">{{ 'users.fields.actor' | t }}</div>
                  <div class="text-base">{{ store.current()?.actorId || '—' }}</div>
                </div>
                <div class="rounded border border-token p-4 bg-surface/50 md:col-span-2">
                  <div class="text-xs text-muted mb-1">{{ 'users.fields.role' | t }}</div>
                  <div class="text-base">
                    <div class="mt-1 flex flex-wrap gap-2">
                      @for (r of (store.current()?.roles || []); track r.id) {
                        <span class="px-2 py-1 rounded-full bg-muted/20 text-xs border border-token">{{ r.name }}</span>
                      }
                      @if ((store.current()?.roles?.length || 0) === 0) {
                        <span class="text-muted text-xs">{{ 'common.none' | t }}</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </app-card>
      } @else {
        <div class="text-center text-muted py-20">{{ 'users.messages.loading' | t }}</div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserViewScreen implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(userStore);

  ngOnInit(): void {
    // Data is expected to be resolved via resolver, store.current should already be populated.
  }

  goBack() { this.router.navigate(['..'], { relativeTo: this.route }); }
  editCurrent() { this.router.navigate(['edit'], { relativeTo: this.route }); }
  createNew() { this.router.navigate(['../new'], { relativeTo: this.route }); }
}
