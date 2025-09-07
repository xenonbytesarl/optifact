import {ChangeDetectionStrategy, Component, inject, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductFormComponent } from '../components/product-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import {SpinnerComponent} from '../../../shared/ui/spinner';
import {useProductScreen} from './product-screen.util';

@Component({
  selector: 'app-product-edit-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ActionBarComponent, CardComponent, SpinnerComponent],
  providers: [],
  template: `
    <app-action-bar
      [showEdit]="false"
      [showNew]="false"
      [disableSave]="form.invalid || loading()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <app-product-form
          [disabled]="loading()"
          [value]="formValue()"
          [nameRequiredError]="nameHasError()"
          (valueChange)="onValueChange($event)"
          (blur)="onNameBlur()"
        />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductEditPage {
  readonly route = inject(ActivatedRoute);
  ui = useProductScreen();

  editedId = signal<string>('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.editedId.set(id);

    effect(() => {
      this.ui.syncFromCurrentIfPristine();
    });
  }

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  nameHasError() { return this.ui.nameHasError(); }
  onValueChange(v: any) { return this.ui.onValueChange(v); }
  onNameBlur() { return this.ui.onNameBlur(); }

  save() { return this.ui.saveEdit(this.editedId()); }
  goBack() { return this.ui.goBack(); }
}
