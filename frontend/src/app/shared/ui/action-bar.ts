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
              <app-button size="sm" variant="primary" shadow="md" hoverShadow="base" rounded="md" tone="primary" icon="add" [label]="'actions.new' | t" [disabled]="disableNew()" (click)="newClicked.emit()" />
            }
            @if(showEdit()) {
              <app-button size="sm" variant="ghost" shadow="md" hoverShadow="base" rounded="md" icon="edit" [label]="'actions.edit' | t" [disabled]="disableEdit()" (click)="editClicked.emit()" />
            }
            @if(showCancel()) {
              <app-button size="sm" variant="ghost" shadow="md" hoverShadow="base" rounded="md" icon="close" [label]="'actions.cancel' | t" [disabled]="disableCancel()" (click)="cancelClicked.emit()" />
            }
            @if(showSave()) {
              <app-button size="sm" variant="primary" shadow="md" hoverShadow="base" rounded="md" tone="primary" icon="save" [label]="'actions.save' | t" [disabled]="disableSave()" (click)="saveClicked.emit()" />
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
