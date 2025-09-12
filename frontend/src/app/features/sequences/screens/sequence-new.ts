import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { useSequenceScreen } from './sequence-screen.util';
import { SequenceFormComponent } from '../components/sequence-form';

@Component({
  selector: 'app-sequence-new-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, SpinnerComponent, SequenceFormComponent],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="form.invalid || loading()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      @if (loading()) { <app-spinner [overlay]="true"/> }
      <app-card>
        <app-sequence-form
          [disabled]="loading()"
          [value]="formValue()"
          [codeRequiredError]="codeHasError()"
          [nameRequiredError]="nameHasError()"
          [stepRequiredError]="stepHasError()"
          [sizeRequiredError]="sizeHasError()"
          [nextRequiredError]="nextHasError()"
          (blurCode)="onCodeBlur()"
          (blurName)="onNameBlur()"
          (blurStep)="onStepBlur()"
          (blurSize)="onSizeBlur()"
          (blurNext)="onNextBlur()"
          (valueChange)="onValueChange($event)"
        />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class SequenceNewPage {
  ui = useSequenceScreen();

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  codeHasError() { return this.ui.codeHasError(); }
  nameHasError() { return this.ui.nameHasError(); }
  stepHasError() { return this.ui.stepHasError(); }
  sizeHasError() { return this.ui.sizeHasError(); }
  nextHasError() { return this.ui.nextHasError(); }

  onValueChange(v: any) { return this.ui.onValueChange(v); }
  onCodeBlur() { return this.ui.onCodeBlur(); }
  onNameBlur() { return this.ui.onNameBlur(); }
  onStepBlur() { return this.ui.onStepBlur(); }
  onSizeBlur() { return this.ui.onSizeBlur(); }
  onNextBlur() { return this.ui.onNextBlur(); }

  save() { return this.ui.saveNew(); }
  goBack() { return this.ui.goBack(); }
}
