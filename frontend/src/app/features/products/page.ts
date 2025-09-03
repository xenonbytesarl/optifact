import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ButtonComponent } from '../../shared/ui/button';
import { IconComponent } from '../../shared/ui/icon';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, IconComponent],
  template: `
    <div class="p-4">
      <app-page-header [title]="'Produits'" [subtitle]="'Catalogue des produits'">
        <div actions>
          <app-button>
            <app-icon name="add"></app-icon>
            Nouveau produit
          </app-button>
        </div>
      </app-page-header>
    </div>
  `
})
export class ProductsPage {}
