import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card';
import { TableComponent } from '../../../shared/ui/table';
import { ButtonComponent } from '../../../shared/ui/button';
import { ActorsApi } from '../../../core/api/actors.api';
import { Actor } from '../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-actors-list-page',
  standalone: true,
  imports: [CommonModule, CardComponent, TableComponent, ButtonComponent, RouterLink],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Liste des acteurs</h2>
          <a routerLink="/actors/new">
            <app-button><span class="material-symbols-outlined text-base">add</span><span class="ml-1">Nouveau</span></app-button>
          </a>
        </div>
        <app-table>
          <thead>
            <tr>
              <th class="text-left p-2">Nom</th>
              <th class="text-left p-2">Référence</th>
              <th class="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              <tr><td colspan="3" class="p-2 text-sm text-muted">Chargement...</td></tr>
            } @else if (actors().length === 0) {
              <tr><td colspan="3" class="p-2 text-sm text-muted">Aucun acteur</td></tr>
            } @else {
              @for (a of actors(); track a.id) {
                <tr>
                  <td class="p-2">{{ a.name }}</td>
                  <td class="p-2">{{ a.reference }}</td>
                  <td class="p-2 text-right">
                    <a [routerLink]="['/actors', a.id]" class="inline-flex items-center text-primary hover:underline mr-2">
                      <span class="material-symbols-outlined text-base">visibility</span>
                    </a>
                    <a [routerLink]="['/actors', a.id, 'edit']" class="inline-flex items-center text-primary hover:underline">
                      <span class="material-symbols-outlined text-base">edit</span>
                    </a>
                  </td>
                </tr>
              }
            }
          </tbody>
        </app-table>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorsListPage {
  api = inject(ActorsApi);
  actors = signal<Actor[]>([]);
  loading = signal(false);

  constructor() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const list = await this.api.list();
      this.actors.set(list ?? []);
    } finally {
      this.loading.set(false);
    }
  }
}
