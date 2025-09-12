import {ChangeDetectionStrategy, Component, input, output, signal, TemplateRef, viewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TableComponent } from '../../../shared/ui/table';
import { TranslateService } from '../../../core/i18n/translate.service';
import { Sequence } from '../../../core/api/sequences.api';
import {DirectionType} from '../../../core/model/direction.enum';

@Component({
  selector: 'app-sequence-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TableComponent],
  template: `
    <app-table [rows]="items()"
               [columns]="columns"
               [sortKey]="sortKey()"
               [sortDir]="sortDir()"
               (sortChange)="onSortChange($event)">

      <ng-template #activeTpl let-row>
        <span class="inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-base" [class]="row.active ? 'text-green-600' : 'text-neutral-400'">
            {{ row.active ? 'check_circle' : 'cancel' }}
          </span>
        </span>
      </ng-template>

      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="view.emit(row.id)">
          <app-icon name="visibility" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="edit.emit(row.id)">
          <app-icon name="edit" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm"  shadow="none" variant="ghost" (clicked)="remove.emit(row.id)">
          <app-icon name="delete"  class="mr-1 text-red-600"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class SequenceListComponent {
  items = input.required<Sequence[]>();
  view = output<string>();
  edit = output<string>();
  remove = output<string>();

  sortKey = signal<string | null>('name');
  sortDir = signal<DirectionType>('ASC');
  sort = output<{ key: string; direction: DirectionType }>();

  activeTpl = viewChild<TemplateRef<any>>('activeTpl');

  constructor(private i18n: TranslateService) {}

  get columns(): { key: string; header: string; template?: TemplateRef<any>; class?: string; headerClass?: string; align?: 'left' | 'center' | 'right'; sortable?: boolean }[] {
    this.i18n.lang();
    return [
      { key: 'code', header: this.i18n.t('sequences.fields.code'), sortable: true },
      { key: 'name', header: this.i18n.t('sequences.fields.name'), sortable: true },
      { key: 'prefix', header: this.i18n.t('sequences.fields.prefix'), sortable: true },
      { key: 'suffix', header: this.i18n.t('sequences.fields.suffix'), sortable: true },
      { key: 'step', header: this.i18n.t('sequences.fields.step'), sortable: true, align: 'right' },
      { key: 'size', header: this.i18n.t('sequences.fields.size'), sortable: true, align: 'right' },
      { key: 'next', header: this.i18n.t('sequences.fields.next'), sortable: true, align: 'right' },
      { key: 'active', header: this.i18n.t('sequences.fields.active'), template: this.activeTpl(), align: 'center' },
    ];
  }

  onSortChange(e: { key: string; direction: DirectionType }) {
    this.sortKey.set(e.key);
    this.sortDir.set(e.direction);
    this.sort.emit(e);
  }
}
