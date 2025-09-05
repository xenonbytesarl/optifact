import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card';
import { ButtonComponent } from '../../../shared/ui/button';
import { ActorListComponent } from '../components/actor-list';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ActorsListStore, provideActorsListStore } from '../actors-list.store';
import { Router, RouterLink } from '@angular/router';
import { PaginatorComponent } from '../../../shared/ui/paginator';
import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog';
import { TranslateService } from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-actors-list-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, RouterLink, PaginatorComponent, ActorListComponent, TranslatePipe],
  providers: [provideActorsListStore()],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'actors.title' | t }}</h2>
          <button routerLink="/actors/new" class="inline-flex">
            <app-button><span class="material-symbols-outlined text-base">add</span><span class="ml-1">{{ 'actors.new' | t }}</span></app-button>
          </button>
        </div>
        <app-actor-list [items]="paged()" (view)="goView($event.id)" (edit)="goEdit($event.id)" (remove)="remove($event.id)" />
        <app-paginator [total]="store.filtered().length" [(page)]="page" [(pageSize)]="pageSize" />
        </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorsListPage {
  readonly store = inject(ActorsListStore);
  page = signal(1);
  pageSize = signal(10);
  paged = computed(() => {
    const list = this.store.filtered();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });
  svc = inject(ConfirmDialogService);
  i18n = inject(TranslateService);

  private router = inject(Router);

  constructor() {
    this.store.loadAll();
  }

  goView(id: string) { this.router.navigate(['/actors', id]); }
  goEdit(id: string) { this.router.navigate(['/actors', id, 'edit']); }

  async remove(id: string) {
    const ok = await this.svc.open({ message: this.i18n.t('confirm.delete.actor') });
    if (!ok) return;
    await this.store.remove(id);
  }
}
