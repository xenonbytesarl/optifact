import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarMenuButtonComponent } from './topbar-menu-button/topbar-menu-button';
import { TopbarBrandComponent } from './topbar-brand/topbar-brand';
import { TopbarSearchComponent } from './topbar-search/topbar-search';
import { TopbarThemeToggleComponent } from './topbar-theme-toogle/topbar-theme-toggle';
import { TopbarNotificationsComponent } from './topbar-notifications/topbar-notifications';
import { TopbarUserMenuComponent } from './topbar-user-menu/topbar-user-menu';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    TopbarMenuButtonComponent,
    TopbarBrandComponent,
    TopbarSearchComponent,
    TopbarThemeToggleComponent,
    TopbarNotificationsComponent,
    TopbarUserMenuComponent
  ],
  templateUrl: './topbar.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopbarComponent {
  isDarkMode = input(false);
  appName = input('Optifact');
  logoSrc = input('/assets/images/logo.png');

  toggleSidebar = output<void>();
  toggleTheme = output<void>();
}
