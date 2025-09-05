import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesStore, provideCategoriesStore } from '../categories.store';
import { CategoryFormComponent, CategoryFormValue } from '../components/category-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';

@Component({
  selector: 'app-category-edit-page',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent, ActionBarComponent, CardComponent],
  providers: [provideCategoriesStore()],
  template: `
    <app-action-bar
      [disableNew]="true"
      [disableEdit]="true"
      [disableCancel]="false"
      [disableSave]="false"
      (cancelClicked)="goBack()"
      (saveClicked)="save()"
    />

    <div class="p-4 flex flex-col gap-4">
      <app-card>
        <app-category-form [value]="formValue()" (valueChange)="formValue.set($event)" (submit)="save($event)" (cancel)="goBack()" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CategoryEditPage implements OnInit {
  readonly store = inject(CategoriesStore);
  readonly route = inject(ActivatedRoute);
  private router = inject(Router);

  editedId = signal<string>('');
  formValue = signal<CategoryFormValue>({ name: '' });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editedId.set(id);
      // ensure list is loaded to have context (optional)
      this.store.loadAll();
    }
  }

  async save(v?: CategoryFormValue) {
    const id = this.editedId();
    if (id) {
      await this.store.update(id, { name: v?.name });
    }
    this.goBack();
  }

  goBack() {
    // navigate deterministically to the list under the same feature shell
    this.router.navigate(['../list']);
  }
}
