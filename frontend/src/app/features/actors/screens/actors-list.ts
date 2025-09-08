import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card';
import { ButtonComponent } from '../../../shared/ui/button';
import { ActorListComponent } from '../components/actor-list';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { actorStore } from '../actors.store';
import {ActivatedRoute, Router} from '@angular/router';
import { PaginatorComponent } from '../../../shared/ui/paginator';
import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog';
import { TranslateService } from '../../../core/i18n/translate.service';
import {IconComponent} from '../../../shared/ui/icon';
import {ToastService} from '../../../shared/ui/toast';
import {ProductSortColumn} from '../../../core/api/products.api';
import {Direction, DirectionType} from '../../../core/model/direction.enum';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../../core/constant/constant';
import {ActorSortColumn} from '../../../core/api/actor/models';

@Component({
  selector: 'app-actors-list-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, PaginatorComponent, ActorListComponent, TranslatePipe, IconComponent],
  providers: [],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'actors.title' | t }}</h2>
          <app-button (click)="goNew()">
            <app-icon name="add" class="mr-1"></app-icon>
            {{ 'actors.new' | t }}
          </app-button>
        </div>
        <app-actor-list
          [items]="store.actorPage().elements"
          (view)="goView($event)"
          (edit)="goEdit($event)"
          (remove)="remove($event)"
          (sort)="onSort($event)"
        />
        <app-paginator
          [total]="store.actorPage().totalElements"
          [page]="uiPage()"
          [pageSize]="uiPageSize()"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        />
        </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorsListPage {
  readonly store = inject(actorStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  svc = inject(ConfirmDialogService);
  i18n = inject(TranslateService);
  toast = inject(ToastService);

  loading = computed(() => this.store.loading());

  // UI page is 1-based; the backend / store page is 0-based
  uiPage = computed(() => (this.store.actorPage().page ?? 0) + 1);
  uiPageSize = computed(() => this.store.actorPage().size ?? 10);

  sortColumn: ProductSortColumn = 'name';
  sortDirection: Direction = Direction.ASC;

  constructor() {}

  async onPageChange(page1Based: number) {
    const size = this.uiPageSize();
    await this.store.search('', '', page1Based - 1, size, this.sortDirection, this.sortColumn);
  }

  async onPageSizeChange(size: number) {
    // Reset page to 0 when size changes
    await this.store.search('', '',  0, size, this.sortDirection, this.sortColumn);
  }

  async onSort(e: { key: string; direction: DirectionType }) {
    // Map UI event to backend Direction and column type
    this.sortColumn = e.key as ActorSortColumn;
    this.sortDirection = e.direction === 'ASC' ? Direction.ASC : Direction.DESC;
    // Reset to the first page on sort change
    const size = this.uiPageSize();
    await this.store.search('', '', 0, size, this.sortDirection, this.sortColumn);
  }

  goEdit(id: string) {
    // navigate to an absolute feature path to avoid relative routing issues causing NG04002
    this.router.navigate(['/actors', id, 'edit']);
  }

  goView(id: string) {
    // navigate to an absolute feature path to avoid relative routing issues causing NG04002
    this.router.navigate(['/actors', id]);
  }

  goNew() {
    this.router.navigate(['/actors', 'new']);
  }

  async remove(id: string) {
    const ok = await this.svc.open({ message: this.i18n.t('confirm.delete.actor') });
    if (!ok) return;
    const response  = await this.store.remove(id);
    // Show success toast after deletion

    if(response) {
      const msg = this.store.message() as string;
      this.toast.success(msg);
      // refresh the table
      this.sortDirection = Direction.ASC;
      this.sortColumn = 'name';
      await this.store.search('', '', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, this.sortDirection, this.sortColumn);
    } else {
      this.toast.error(this.store.error() || this.i18n.t('common.error'));
    }

  }
}
