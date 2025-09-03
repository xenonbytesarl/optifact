import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <div class="p-4">
      <app-page-header [title]="'Paramètres'" [subtitle]="'Préférences de l’application'" />
    </div>
  `
})
export class SettingsPage {}
