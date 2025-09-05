import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslatePipe],
  template: `
  <div class="sticky top-0 z-30 h-14 px-4 bg-[rgb(var(--color-bg))]/95 backdrop-blur shadow flex items-center justify-between">
    <div class="font-medium">{{ title() }}</div>
    <div class="inline-flex items-center gap-2">
      <app-button size="sm" variant="secondary" shadow="sm" hoverShadow="base" [disabled]="disableNew()" (clicked)="newClicked.emit()">{{ 'actions.new' | t }}</app-button>
      <app-button size="sm" variant="secondary" shadow="sm" hoverShadow="base" [disabled]="disableEdit()" (clicked)="editClicked.emit()">{{ 'actions.edit' | t }}</app-button>
      <app-button size="sm" variant="ghost" shadow="sm" hoverShadow="base" [disabled]="disableCancel()" (clicked)="cancelClicked.emit()">{{ 'actions.cancel' | t }}</app-button>
      <app-button size="sm" variant="primary" shadow="sm" hoverShadow="base" [disabled]="disableSave()" (clicked)="saveClicked.emit()">{{ 'actions.save' | t }}</app-button>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActionBarComponent {
  title = input<string>('Acteur');
  disableNew = input<boolean>(false);
  disableEdit = input<boolean>(false);
  disableCancel = input<boolean>(false);
  disableSave = input<boolean>(false);

  newClicked = output<void>();
  editClicked = output<void>();
  cancelClicked = output<void>();
  saveClicked = output<void>();
}
