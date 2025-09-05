import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card';
import { TableComponent } from '../../../shared/ui/table';
import { ButtonComponent } from '../../../shared/ui/button';
import { ActorsApi } from '../../../core/api/actors.api';
import { Actor } from '../models';
import { RouterLink } from '@angular/router';
import { PaginatorComponent } from '../../../shared/ui/paginator';

@Component({
  selector: 'app-actors-list-page',
  standalone: true,
  imports: [CommonModule, CardComponent, TableComponent, ButtonComponent, RouterLink, PaginatorComponent],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Liste des acteurs</h2>
          <a routerLink="/actors/new">
            <app-button><span class="material-symbols-outlined text-base">add</span><span class="ml-1">Nouveau</span></app-button>
          </a>
        </div>
        <app-table [rows]="paged()" [columns]="actorColumns">
          <ng-template #actions let-row>
            <a [routerLink]="['/actors', row.id]" class="inline-flex items-center text-primary hover:underline mr-2">
              <span class="material-symbols-outlined text-base">visibility</span>
            </a>
            <a [routerLink]="['/actors', row.id, 'edit']" class="inline-flex items-center text-primary hover:underline">
              <span class="material-symbols-outlined text-base">edit</span>
            </a>
          </ng-template>
        </app-table>
          <app-paginator [total]="actors().length" [(page)]="page" [(pageSize)]="pageSize" />
        </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorsListPage {
  actorColumns = [
    { key: 'name', header: 'Nom' },
    { key: 'reference', header: 'Référence' },
  ];
  api = inject(ActorsApi);
  actors = signal<Actor[]>([]);
  loading = signal(false);
  page = signal(1);
  pageSize = signal(10);
  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.actors().slice(start, start + this.pageSize());
  });

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
