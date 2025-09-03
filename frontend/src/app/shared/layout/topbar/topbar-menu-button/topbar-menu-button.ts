import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../ui/icon';
import { ButtonComponent } from '../../../ui/button';

@Component({
  selector: 'app-topbar-menu-button',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <app-button class="lg:hidden" size="icon" variant="ghost" (clicked)="toggle.emit()" aria-label="Ouvrir le menu">
      <app-icon name="menu"></app-icon>
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarMenuButtonComponent {
  toggle = output<void>();
}
