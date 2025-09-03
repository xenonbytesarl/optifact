import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ButtonComponent } from '../../shared/ui/button';
import { IconComponent } from '../../shared/ui/icon';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, IconComponent],
  template: `
    <div class="p-4">
      <app-page-header [title]="'Dashboard'">
        <div actions>
          <app-button variant="ghost">
            <app-icon name="refresh"></app-icon>
            Actualiser
          </app-button>
        </div>
      </app-page-header>
    </div>
  `
})
export class DashboardPage {}
