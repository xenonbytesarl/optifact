import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from '../components/user-form';
import { AutocompleteItem } from '../../../shared/ui/autocomplete';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { actorStore } from '../../actors/actors.store';
import { useUserScreen } from './user-screen.util';

@Component({
  selector: 'app-user-new',
  standalone: true,
  imports: [CommonModule, UserFormComponent, ActionBarComponent, CardComponent],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="invalid() || loading()"
      (saveClicked)="saveNew()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      <app-card>
        <app-user-form [value]="formValue()" [roles]="store.roles()" [actors]="actors()" (valueChange)="onValueChange($event)" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNewScreen {
  private util = useUserScreen();
  store = this.util.store;
  actStore = inject(actorStore);

  // expose util API to template
  formValue = this.util.formValue;
  loading = this.util.loading;
  invalid = this.util.invalid;
  onValueChange = this.util.onValueChange;
  saveNew = this.util.saveNew;
  goBack = this.util.goBack;

  actors = computed(() =>
    this.actStore.actorPage().elements?.map((a: any) => ({ value: a.id, label: a.name } as AutocompleteItem))
  );
}
