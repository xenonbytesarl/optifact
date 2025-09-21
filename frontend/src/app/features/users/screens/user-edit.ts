import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from '../components/user-form';
import { AutocompleteItem } from '../../../shared/ui/autocomplete';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { actorStore } from '../../actors/actors.store';
import { useUserScreen } from './user-screen.util';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, UserFormComponent, ActionBarComponent, CardComponent],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [showSave]="false"
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
export class UserEditScreen implements OnInit {
  private util = useUserScreen();
  store = this.util.store;
  actStore = inject(actorStore);

  // expose util API
  formValue = this.util.formValue;
  onValueChange = this.util.onValueChange;
  goBack = this.util.goBack;

  actors = computed(() =>
    this.actStore.actorPage().elements?.map((a: any) => ({ value: a.id, label: a.name } as AutocompleteItem))
  );

  ngOnInit(): void {
    // Roles and current user are preloaded by route resolver
    this.util.setFromCurrent();
  }
}
