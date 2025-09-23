import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../shared/ui/table';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { UserView } from '../../../core/api/user.api';
import { TranslateService } from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, TableComponent, ButtonComponent, IconComponent],
  template: `
    <app-table [rows]="items()"
               [columns]="columns"
               [selectable]="false">
      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="view.emit(row.id)">
          <app-icon name="visibility" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="edit.emit(row.id)">
          <app-icon name="edit" class="mr-1"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserListComponent {
  readonly i18n = inject(TranslateService);

  items = input.required<UserView[]>();
  view = output<string>();
  edit = output<string>();

  get columns() {
    // recompute on lang changes
    this.i18n.lang();
    return [
      { key: 'lastname', header: this.i18n.t('users.fields.lastname') },
      { key: 'firstname', header: this.i18n.t('users.fields.firstname') },
      { key: 'email', header: this.i18n.t('users.fields.email'), sortable: true },
      { key: 'phone', header: this.i18n.t('users.fields.phone') },
    ];
  }
}
