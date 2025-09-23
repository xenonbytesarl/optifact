import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../shared/ui/card';
import { ButtonComponent } from '../../../shared/ui/button';
import { PaginatorComponent } from '../../../shared/ui/paginator';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { UserListComponent } from '../components/user-list';
import { userStore } from '../user.store';
import { Page } from '../../../core/model/response.model';
import { UserView } from '../../../core/api/user.api';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../core/constant/constant';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, PaginatorComponent, TranslatePipe, UserListComponent],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'users.title' | t }}</h2>
          <app-button icon="add" [label]="'users.new' | t" (click)="goNew()" />
        </div>

        <app-user-list
          [items]="page().elements"
          (view)="goView($event)"
          (edit)="goEdit($event)"
        />
        <app-paginator
          [total]="page().totalElements"
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
export class UsersListPage {
  readonly store = inject(userStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  // keep local page state since store doesn't hold it
  page = signal<Page<UserView>>({ elements: [], totalElements: 0, page: 0, size: DEFAULT_PAGE_SIZE, totalPages: 0, isFirst: true, isLast: true });

  uiPage = computed(() => (this.page().page ?? 0) + 1);
  uiPageSize = computed(() => this.page().size ?? DEFAULT_PAGE_SIZE);

  constructor() {
    // If resolver already executed, we can optionally pull from store by re-searching defaults
    this.init();
  }

  async init() {
    const p = await this.store.search({ page: DEFAULT_PAGE_NUMBER, size: DEFAULT_PAGE_SIZE, sortField: 'id', sortDirection: 'ASC' });
    this.page.set(p);
  }

  async onPageChange(page1Based: number) {
    const p = await this.store.search({ page: page1Based - 1, size: this.uiPageSize(), sortField: 'id', sortDirection: 'ASC' });
    this.page.set(p);
  }

  async onPageSizeChange(size: number) {
    const p = await this.store.search({ page: DEFAULT_PAGE_NUMBER, size, sortField: 'id', sortDirection: 'ASC' });
    this.page.set(p);
  }

  goEdit(id: string) {
    this.router.navigate(['/users', id, 'edit']);
  }

  goView(id: string) {
    this.router.navigate(['/users', id]);
  }

  goNew() {
    this.router.navigate(['/users', 'new']);
  }
}
