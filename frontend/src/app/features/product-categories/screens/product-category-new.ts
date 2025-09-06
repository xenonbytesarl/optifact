import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCategoryFormComponent } from '../components/product-category-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { useProductCategoryScreen } from './product-category-screen.util';

@Component({
  selector: 'app-product-category-new-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCategoryFormComponent, ActionBarComponent, CardComponent, SpinnerComponent],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="form.invalid || loading()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4 relative">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <app-product-category-form
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
export class ProductCategoryNewPage {
  ui = useProductCategoryScreen();

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  nameHasError() { return this.ui.nameHasError(); }
  onValueChange(v: any) { return this.ui.onValueChange(v); }
  onNameBlur() { return this.ui.onNameBlur(); }

  save() { return this.ui.saveNew(); }
  goBack() { return this.ui.goBack(); }
}
