import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../components/product-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import {SpinnerComponent} from '../../../shared/ui/spinner';
import {useProductScreen} from './product-screen.util';

@Component({
  selector: 'app-product-new-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ActionBarComponent, CardComponent, SpinnerComponent],
  providers: [],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
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
          [codeRequiredError]="codeHasError()"
          [nameRequiredError]="nameHasError()"
          [typeRequiredError]="typeHasError()"
          [categoryIdRequiredError]="categoryIdHasError()"
          [rateRequiredError]="rateHasError()"
          [amountRequiredError]="amountHasError()"
          (blurCode)="onCodeBlur()"
          (blurName)="onNameBlur()"
          (blurType)="onTypeBlur()"
          (blurCategory)="onCategoryIdBlur()"
          (blurAmount)="onAmountBlur()"
          (blurRate)="onRateBlur()"
          (valueChange)="onValueChange($event)"
        />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductNewPage {
  ui = useProductScreen();

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  codeHasError() { return this.ui.codeHasError(); }
  nameHasError() { return this.ui.nameHasError(); }
  typeHasError() { return this.ui.typeHasError(); }
  rateHasError() { return this.ui.rateHasError(); }
  amountHasError() { return this.ui.amountHasError(); }
  categoryIdHasError() { return this.ui.categoryIdHasError(); }
  onValueChange(v: any) { return this.ui.onValueChange(v); }
  onCodeBlur() { return this.ui.onCodeBlur(); }
  onNameBlur() { return this.ui.onNameBlur(); }
  onTypeBlur() { return this.ui.onTypeBlur(); }
  onCategoryIdBlur() { return this.ui.onCategoryIdBlur(); }
  onRateBlur() { return this.ui.onRateBlur(); }
  onAmountBlur() { return this.ui.onAmountBlur(); }

  save() { return this.ui.saveNew(); }
  goBack() { return this.ui.goBack(); }
}
