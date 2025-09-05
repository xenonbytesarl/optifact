import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { CategoriesStore, provideCategoriesStore } from '../categories.store';
import { CategoryListComponent } from '../components/category-list';

@Component({
  selector: 'app-categories-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, IconComponent, TranslatePipe, CategoryListComponent],
  providers: [provideCategoriesStore()],
  template: `
    <div class="p-4 flex flex-col gap-4">
      <div class="flex justify-end">
        <a routerLink="../new">
          <app-button>
            <app-icon name="add" class="mr-1"></app-icon>
            {{ 'productCategories.new' | t }}
          </app-button>
        </a>
      </div>

      <app-category-list [items]="store.filtered()" (edit)="goEdit($event.id)" (remove)="remove($event.id)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CategoriesListPage {
  readonly store = inject(CategoriesStore);
  private router = inject(Router);

  constructor() {
    // load all when list screen mounts
    this.store.loadAll();
  }

  goEdit(id: string) {
    this.router.navigate(['../', id, 'edit']);
  }

  async remove(id: string) {
    await this.store.remove(id);
  }
}
