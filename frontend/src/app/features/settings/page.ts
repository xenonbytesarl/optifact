import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [PageHeaderComponent, TranslatePipe],
  template: `
    <div class="p-4">
      <app-page-header [title]="('settings.title' | t)" [subtitle]="('settings.subtitle' | t)" />
    </div>
  `
})
export class SettingsPage {}
