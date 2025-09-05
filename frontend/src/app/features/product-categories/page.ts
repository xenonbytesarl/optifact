import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-product-categories-page',
  standalone: true,
  imports: [PageHeaderComponent, RouterOutlet, TranslatePipe],
  template: `
    <div class="p-4">
      <app-page-header [title]="('productCategories.title' | t)" [subtitle]="('productCategories.subtitle' | t)"></app-page-header>
    </div>
    <router-outlet />
  `
})
export class ProductCategoriesPage {}
