import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../ui/button';

@Component({
  selector: 'app-topbar-user-menu',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button class="ml-1" size="sm" variant="ghost" aria-label="Menu utilisateur" shadow="none" hoverShadow="none">
      <span class="inline-flex h-7 w-7  bg-[var(--color-primary)] text-white items-center justify-center text-sm">OU</span>
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarUserMenuComponent {}
