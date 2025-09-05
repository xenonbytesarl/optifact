import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button';
import { CardComponent } from './card';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, TranslatePipe],
  template: `
    <div class="sticky top-0 z-30 px-4 pt-2">
      <app-card>
        <div class="h-14 flex items-center justify-between">
          <div class="font-medium text-sm md:text-base"></div>
          <div class="inline-flex items-center gap-2">
            <app-button size="md" variant="primary" shadow="md" hoverShadow="base" [disabled]="disableNew()" (clicked)="newClicked.emit()">
              <span class="material-symbols-outlined text-base">add</span>
              <span class="hidden sm:inline">{{ 'actions.new' | t }}</span>
            </app-button>
            <app-button size="md" variant="ghost" shadow="md" hoverShadow="base" [disabled]="disableEdit()" (clicked)="editClicked.emit()">
              <span class="material-symbols-outlined text-base">edit</span>
              <span class="hidden sm:inline">{{ 'actions.edit' | t }}</span>
            </app-button>
            <app-button size="md" variant="ghost" shadow="md" hoverShadow="base" [disabled]="disableCancel()" (clicked)="cancelClicked.emit()">
              <span class="material-symbols-outlined text-base">close</span>
              <span class="hidden sm:inline">{{ 'actions.cancel' | t }}</span>
            </app-button>
            <app-button size="md" variant="primary" shadow="md" hoverShadow="base" [disabled]="disableSave()" (clicked)="saveClicked.emit()">
              <span class="material-symbols-outlined text-base">save</span>
              <span class="hidden sm:inline">{{ 'actions.save' | t }}</span>
            </app-button>
          </div>
        </div>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActionBarComponent {
  disableNew = input<boolean>(false);
  disableEdit = input<boolean>(false);
  disableCancel = input<boolean>(false);
  disableSave = input<boolean>(false);

  newClicked = output<void>();
  editClicked = output<void>();
  cancelClicked = output<void>();
  saveClicked = output<void>();
}
