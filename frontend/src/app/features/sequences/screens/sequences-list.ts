import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { CardComponent } from '../../../shared/ui/card';
import { PaginatorComponent } from '../../../shared/ui/paginator';
import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog';
import { TranslateService } from '../../../core/i18n/translate.service';
import { ToastService } from '../../../shared/ui/toast';
import { Direction, DirectionType } from '../../../core/model/direction.enum';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../core/constant/constant';
import { sequencesStore } from '../sequences.store';
import { SequenceSortColumn } from '../../../core/api/sequences.api';
import { SequenceListComponent } from '../components/sequence-list';

@Component({
  selector: 'app-sequences-list-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe, CardComponent, PaginatorComponent, SequenceListComponent],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'sequences.title' | t }}</h2>
          <app-button (click)="goNew()">
            <app-icon name="add" class="mr-1"></app-icon>
            {{ 'sequences.new' | t }}
          </app-button>
        </div>

        <app-sequence-list
          [items]="store.sequencePage().elements"
          (view)="goView($event)"
          (edit)="goEdit($event)"
          (remove)="remove($event)"
          (sort)="onSort($event)"
        />
        <app-paginator
          [total]="store.sequencePage().totalElements"
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
export class SequencesListPage {
  readonly store = inject(sequencesStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  svc = inject(ConfirmDialogService);
  i18n = inject(TranslateService);
  toast = inject(ToastService);

  loading = computed(() => this.store.loading());

  uiPage = computed(() => (this.store.sequencePage().page ?? 0) + 1);
  uiPageSize = computed(() => this.store.sequencePage().size ?? 10);

  sortColumn: SequenceSortColumn = 'name';
  sortDirection: Direction = Direction.ASC;

  constructor() {}

  async onPageChange(page1Based: number) {
    const size = this.uiPageSize();
    await this.store.search('', '', '', '', page1Based - 1, size, this.sortDirection, this.sortColumn);
  }

  async onPageSizeChange(size: number) {
    await this.store.search('', '', '', '', 0, size, this.sortDirection, this.sortColumn);
  }

  async onSort(e: { key: string; direction: DirectionType }) {
    this.sortColumn = (e.key as SequenceSortColumn);
    this.sortDirection = e.direction === 'ASC' ? Direction.ASC : Direction.DESC;
    const size = this.uiPageSize();
    await this.store.search('', '', '', '', 0, size, this.sortDirection, this.sortColumn);
  }

  goEdit(id: string) {
    this.router.navigate(['/sequences', id, 'edit']);
  }

  goView(id: string) {
    this.router.navigate(['/sequences', id]);
  }

  goNew() {
    this.router.navigate(['/sequences', 'new']);
  }

  async remove(id: string) {
    const ok = await this.svc.open({ message: this.i18n.t('confirm.message.default') });
    if (!ok) return;
    const response = await this.store.remove(id);
    if (response) {
      this.toast.success(this.store.message() as string);
      this.sortDirection = Direction.ASC;
      this.sortColumn = 'name';
      await this.store.search('', '', '', '', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, this.sortDirection, this.sortColumn);
    } else {
      this.toast.error(this.store.error() || this.i18n.t('common.error'));
    }
  }
}
