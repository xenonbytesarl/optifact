import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ButtonComponent } from '../../shared/ui/button';
import { IconComponent } from '../../shared/ui/icon';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, IconComponent, TranslatePipe],
  template: `
    <div class="p-4">
      <app-page-header [title]="('dashboard.title' | t)">
        <div actions>
          <app-button variant="ghost">
            <app-icon name="refresh"></app-icon>
            {{ 'dashboard.refresh' | t }}
          </app-button>
        </div>
      </app-page-header>
    </div>
  `
})
export class DashboardPage {}
