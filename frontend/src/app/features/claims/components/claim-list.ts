import { ChangeDetectionStrategy, Component, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TableComponent } from '../../../shared/ui/table';
import { Claim } from '../../../core/api/claim.api';
import { DirectionType } from '../../../core/model/direction.enum';
import {BadgeComponent, BadgeTone} from '../../../shared/ui/badge';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TableComponent, BadgeComponent],
  template: `
    <app-table [rows]="items()"
               [columns]="columns"
               [sortKey]="sortKey()"
               [sortDir]="sortDir()"
               (sortChange)="onSortChange($event)">

      <ng-template #stateTpl let-row>
        <app-badge [tone]="stateTone(row.state)">
          {{ getStateLabel(row.state) }}
        </app-badge>
      </ng-template>

      <ng-template #dateTpl let-row>
        {{ row.createdAt | date:'short' }}
      </ng-template>

      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="view.emit(row.id)">
          <app-icon name="visibility" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="edit.emit(row.id)">
          <app-icon name="edit" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="remove.emit(row.id)">
          <app-icon name="delete" class="mr-1 text-red-600"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimListComponent {
  items = input.required<Claim[]>();
  view = output<string>();
  edit = output<string>();
  remove = output<string>();

  sortKey = signal<string | null>('createdAt');
  sortDir = signal<DirectionType>('DESC');
  sort = output<{ key: string; direction: DirectionType }>();

  stateTpl = viewChild<TemplateRef<any>>('stateTpl');
  dateTpl = viewChild<TemplateRef<any>>('dateTpl');

  constructor(private i18n: TranslateService) {}

  get columns() {
    this.i18n.lang();
    return [
      { key: 'reference', header: this.i18n.t('claims.fields.reference'), sortable: true },
      { key: 'createdAt', header: this.i18n.t('claims.fields.createdAt'), template: this.dateTpl(), sortable: true },
      { key: 'actorName', header: this.i18n.t('claims.fields.actorName') },
      { key: 'productName', header: this.i18n.t('claims.fields.productName') },
      { key: 'state', header: this.i18n.t('claims.fields.state'), template: this.stateTpl(), sortable: true },
    ];
  }

  onSortChange(e: { key: string; direction: DirectionType }) {
    this.sortKey.set(e.key);
    this.sortDir.set(e.direction);
    this.sort.emit(e);
  }

  stateTone(state?: string | null): BadgeTone {
    switch (state) {
      case 'DRAFT': return 'neutral';
      case 'SUBMIT': return 'info';
      case 'IN_INSTRUCTION': return 'warn';
      case 'REJECT': return 'danger';
      case 'VALIDATED': return 'success';
      case 'DONE': return 'success';
      case 'CANCELLED': return 'neutral';
      default: return 'neutral';
    }
  }

  getStateLabel(state?: string | null) {
    switch (state) {
      case 'DRAFT': return this.i18n.t('claims.states.draft');
      case 'SUBMIT': return this.i18n.t('claims.states.submit');
      case 'IN_INSTRUCTION': return this.i18n.t('claims.states.in_instruction');
      case 'REJECT': return this.i18n.t('claims.states.reject');
      case 'VALIDATED': return this.i18n.t('claims.states.validated');
      case 'DONE': return this.i18n.t('claims.states.done');
      case 'CANCELLED': return this.i18n.t('claims.states.cancelled');
      default: return '';
    }
  }
}
