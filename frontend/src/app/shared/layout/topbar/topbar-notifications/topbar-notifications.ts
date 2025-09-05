import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../ui/icon';
import { ButtonComponent } from '../../../ui/button';

@Component({
  selector: 'app-topbar-notifications',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <app-button class="hidden sm:inline-flex " size="icon" variant="ghost" aria-label="Notifications" shadow="none" hoverShadow="none">
      <app-icon name="notifications"></app-icon>
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarNotificationsComponent {}
