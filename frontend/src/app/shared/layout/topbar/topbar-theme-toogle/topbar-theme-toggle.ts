import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../ui/icon';
import { ButtonComponent } from '../../../ui/button';

@Component({
  selector: 'app-topbar-theme-toggle',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <app-button size="icon" variant="ghost" (clicked)="toggle.emit()" aria-label="Changer de thème" shadow="none" hoverShadow="none">
      <app-icon [name]="isDark() ? 'light_mode' : 'dark_mode'" class="text-xl"></app-icon>
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarThemeToggleComponent {
  isDark = input(false);
  toggle = output<void>();
}
