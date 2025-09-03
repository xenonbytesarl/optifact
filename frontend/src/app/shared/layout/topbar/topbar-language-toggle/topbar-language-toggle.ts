import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../../../core/i18n/translate.service';
import { IconComponent } from '../../../ui/icon';
import { ButtonComponent } from '../../../ui/button';

@Component({
  selector: 'app-topbar-language-toggle',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <app-button variant="ghost" size="sm" class="ml-1"
                shadow="none" hoverShadow="none"
                (clicked)="toggle()"
                [attr.aria-label]="aria()">
      <app-icon name="translate" class="text-xl"></app-icon>
      <span class="uppercase">{{ lang() }}</span>
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarLanguageToggleComponent {
  private i18n = inject(TranslateService);
  lang = computed(() => this.i18n.lang());
  aria = computed(() => this.i18n.lang() === 'fr' ? 'Basculer langue en anglais' : 'Switch language to French');
  toggle() { this.i18n.toggle(); }
}
