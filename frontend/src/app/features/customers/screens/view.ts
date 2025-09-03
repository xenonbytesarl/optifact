import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';

@Component({
  selector: 'app-customer-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent],
  template: `
    <app-action-bar [disableNew]="false" [disableEdit]="false" [disableCancel]="true" [disableSave]="true" />
    <div class="p-4">Détails du client (lecture seule) — à implémenter</div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomerViewPage {}
