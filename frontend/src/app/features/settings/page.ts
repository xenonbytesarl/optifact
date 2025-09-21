import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [PageHeaderComponent, TranslatePipe, RouterOutlet],
  template: `
    <div class="p-4 space-y-4">
      <app-page-header [title]="('settings.title' | t)" [subtitle]="('settings.subtitle' | t)" />
      <router-outlet />
    </div>
  `
})
export class SettingsPage {}
