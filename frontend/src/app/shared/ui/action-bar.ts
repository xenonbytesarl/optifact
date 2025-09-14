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
    <div class="sticky top-0 z-30 px-4 pt-1">
      <app-card>
        <div class="h-12 flex items-center justify-between">
          <div class="font-medium text-sm md:text-base"></div>
          <div class="inline-flex items-center gap-2">
            @if(showNew()) {
              <app-button size="md" variant="primary" shadow="md" hoverShadow="base" rounded="none" [disabled]="disableNew()" (click)="newClicked.emit()">
                <span class="material-symbols-outlined text-sm">add</span>
                <span class="hidden sm:inline">{{ 'actions.new' | t }}</span>
              </app-button>
            }
            @if(showEdit()) {
              <app-button size="md" variant="ghost" shadow="md" hoverShadow="base" rounded="none" [disabled]="disableEdit()" (click)="editClicked.emit()">
                <span class="material-symbols-outlined text-sm">edit</span>
                <span class="hidden sm:inline">{{ 'actions.edit' | t }}</span>
              </app-button>
            }
            @if(showCancel()) {
              <app-button size="md" variant="ghost" shadow="md" hoverShadow="base" rounded="none" [disabled]="disableCancel()" (click)="cancelClicked.emit()">
                <span class="material-symbols-outlined text-sm">close</span>
                <span class="hidden sm:inline">{{ 'actions.cancel' | t }}</span>
              </app-button>
            }
            @if(showSave()) {
              <app-button size="md" variant="primary" shadow="md" hoverShadow="base" rounded="none" [disabled]="disableSave()" (click)="saveClicked.emit()">
                <span class="material-symbols-outlined text-sm">save</span>
                <span class="hidden sm:inline">{{ 'actions.save' | t }}</span>
              </app-button>
            }
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

  showNew = input<boolean>(true);
  showEdit = input<boolean>(true);
  showCancel = input<boolean>(true);
  showSave = input<boolean>(true)

  newClicked = output<void>();
  editClicked = output<void>();
  cancelClicked = output<void>();
  saveClicked = output<void>();
}
