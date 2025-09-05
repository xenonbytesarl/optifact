import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TableComponent } from '../../../shared/ui/table';
import { Actor } from '../models';

@Component({
  selector: 'app-actor-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe, TableComponent],
  template: `
    <app-table [rows]="items()" [columns]="columns">
      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="view.emit(row)">
          <app-icon name="visibility" class="mr-1"></app-icon>{{ 'actions.view' | t }}
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="edit.emit(row)">
          <app-icon name="edit" class="mr-1"></app-icon>{{ 'actions.edit' | t }}
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="remove.emit(row)">
          <app-icon name="delete" class="mr-1"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorListComponent {
  items = input.required<Actor[]>();
  view = output<Actor>();
  edit = output<Actor>();
  remove = output<Actor>();

  constructor(private i18n: TranslateService) {}

  get columns() {
    // Depend on lang so headers update with language
    this.i18n.lang();
    return [
      { key: 'name', header: this.i18n.t('actors.fields.name') ?? 'Nom' },
      { key: 'reference', header: this.i18n.t('actors.fields.reference') ?? 'Référence' },
    ];
  }
}
