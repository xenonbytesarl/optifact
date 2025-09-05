import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';

@Component({
  selector: 'app-actor-edit-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent],
  template: `
    <app-action-bar [disableNew]="false" [disableEdit]="true" [disableCancel]="false" [disableSave]="false" />
    <div class="p-4">Édition à implémenter</div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorEditPage {}
