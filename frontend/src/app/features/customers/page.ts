import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ButtonComponent } from '../../shared/ui/button';
import { IconComponent } from '../../shared/ui/icon';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, IconComponent],
  template: `
    <div class="p-4">
      <app-page-header [title]="'Clients'" [subtitle]="'Gérez vos clients'">
        <div actions>
          <app-button>
            <app-icon name="add"></app-icon>
            Nouveau client
          </app-button>
        </div>
      </app-page-header>
    </div>
  `
})
export class CustomersPage {}
