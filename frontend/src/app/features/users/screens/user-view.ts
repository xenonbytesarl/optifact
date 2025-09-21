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
    <div class="flex flex-col gap-6">
      <app-action-bar
        [showCancel]="false"
        [showSave]="false"
        (newClicked)="createNew()"
        (editClicked)="editCurrent()"
        (cancelClicked)="goBack()"
      />

      @if (store.current()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-card [title]="'users.sections.identity' | t">
            <div class="grid grid-cols-1 gap-3 text-sm">
              <div class="flex items-center justify-between">
                <div class="text-muted inline-flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">badge</span>
                  {{ 'users.fields.firstname' | t }}
                </div>
                <div class="font-medium">{{ store.current()?.firstname || '-' }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-muted inline-flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">id_card</span>
                  {{ 'users.fields.lastname' | t }}
                </div>
                <div class="font-medium">{{ store.current()?.lastname || '-' }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-muted inline-flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">mail</span>
                  {{ 'users.fields.email' | t }}
                </div>
                <div class="font-medium break-all">{{ store.current()?.email || '-' }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-muted inline-flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">call</span>
                  {{ 'users.fields.phone' | t }}
                </div>
                <div class="font-medium">{{ store.current()?.phone || '-' }}</div>
              </div>
            </div>
          </app-card>

          <app-card [title]="'users.sections.relations' | t">
            <div class="grid grid-cols-1 gap-3 text-sm">
              <div class="flex items-center justify-between">
                <div class="text-muted inline-flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">person</span>
                  {{ 'users.fields.actor' | t }}
                </div>
                <div class="font-medium">{{ store.current()?.actorId || '-' }}</div>
              </div>
              <div>
                <div class="text-muted inline-flex items-center gap-1">
                  <span class="material-symbols-outlined text-base">shield_person</span>
                  {{ 'users.fields.roles' | t }}
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  @for (r of (store.current()?.roles || []); track r.id) {
                    <span class="px-2 py-1 rounded-full bg-muted/20 text-xs border border-token">
                      {{ r.name }}
                    </span>
                  }
                  @if ((store.current()?.roles?.length || 0) === 0) {
                    <span class="text-muted text-xs">{{ 'common.none' | t }}</span>
                  }
                </div>
              </div>
            </div>
          </app-card>
        </div>
      } @else {
        <div class="text-center text-muted py-20">{{ 'users.messages.loading' | t }}</div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserViewScreen implements OnInit {
  store = inject(userStore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) await this.store.findById(id);
  }

  goBack() { this.router.navigate(['..']); }
  editCurrent() { this.router.navigate(['edit'], { relativeTo: this.route }); }
  createNew() { this.router.navigate(['../new'], { relativeTo: this.route }); }
}
