import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { ActorTabsComponent } from '../components/actor-tabs';
import { ActorsStore, provideActorsStore } from '../actors.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-actor-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, ActorTabsComponent, RouterLink],
  providers: [provideActorsStore()],
  template: `
    <app-action-bar [disableNew]="false" [disableEdit]="false" [disableCancel]="true" [disableSave]="true" />

    <div class="p-4 space-y-4">
      <app-card>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <div class="text-sm text-muted">Nom</div>
            <div class="text-base">{{ actorName() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Référence</div>
            <div class="text-base">{{ actorRef() }}</div>
          </div>
        </div>
        <div class="mt-4">
          <a class="inline-flex items-center text-primary hover:underline" [routerLink]="['edit']">
            <span class="material-symbols-outlined text-base mr-1">edit</span>Modifier
          </a>
        </div>
      </app-card>

      <app-card>
        <app-actor-tabs [addresses]="store.addresses()" [contacts]="store.contacts()" [readonly]="true" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorViewPage {
  store = inject(ActorsStore);
  route = inject(ActivatedRoute);

  actorName = computed(() => this.store.currentActor()?.name ?? '');
  actorRef = computed(() => this.store.currentActor()?.reference ?? '');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.load(id);
  }
}
