import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ButtonComponent } from '../../shared/ui/button';
import { IconComponent } from '../../shared/ui/icon';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, IconComponent, TranslatePipe],
  template: `
    <div class="p-4">
      <app-page-header [title]="('products.title' | t)" [subtitle]="('products.subtitle' | t)">
        <div actions>
          <app-button>
            <app-icon name="add"></app-icon>
            {{ 'products.new' | t }}
          </app-button>
        </div>
      </app-page-header>
    </div>
  `
})
export class ProductsPage {}
