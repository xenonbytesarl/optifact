import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { ActorTabsComponent } from '../components/actor-tabs';
import { actorStore } from '../actors.store';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslateService} from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-actor-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, ActorTabsComponent],
  providers: [],
  template: `
    <app-action-bar [showCancel]="false" [showSave]="false" (newClicked)="goNew()" (editClicked)="goEdit()" />

    <div class="p-4 space-y-4">
      <app-card>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <div class="text-sm text-muted">Nom</div>
            <div class="text-base">{{ actorName() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Référence</div>
            <div class="text-base">{{ actorReference() }}</div>
          </div>
        </div>
        <div class="mt-6">
          <app-actor-tabs [addresses]="store.addresses()" [contacts]="store.contacts()" [readonly]="true" />
        </div>
      </app-card>


    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorViewPage {
  readonly store = inject(actorStore);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly i18n = inject(TranslateService);

  loading = computed(() => this.store.loading());

  id = computed(() => this.store.current()?.id ?? '');
  actorName = computed(() => this.store.current()?.name ?? '');
  actorReference = computed(() => this.store.current()?.reference ?? '');

  constructor() {}

  goNew() {
    this.router.navigate(['/actors', 'new']);
  }

  goEdit() {
    this.router.navigate(['/actors', this.id(), 'edit']);
  }
}
