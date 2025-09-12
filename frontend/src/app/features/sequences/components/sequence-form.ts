import {ChangeDetectionStrategy, Component, input, model, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { InputTextComponent } from '../../../shared/ui/input';
import { InputNumberComponent } from '../../../shared/ui/input-number';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import {Sequence} from '../../../core/api/sequences.api';

export interface SequenceFormValue {
  code: string;
  name: string;
  step: number | null;
  size: number | null;
  next: number | null;
  prefix?: string | null;
  suffix?: string | null;
  active: boolean;
}

@Component({
  selector: 'app-sequence-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputTextComponent, InputNumberComponent, FormFieldComponent],
  template: `
    <form class="flex flex-col gap-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <app-form-field [label]="('sequences.fields.code' | t)" [required]="true" [error]="codeRequiredError() ? ('validation.required' | t) : null">
          <app-input [disabled]="disabled()" [error]="codeRequiredError()" [value]="value().code" (valueChange)="onCode($event)" (blurred)="blurCode.emit()" />
        </app-form-field>
        <app-form-field [label]="('sequences.fields.name' | t)" [required]="true" [error]="nameRequiredError() ? ('validation.required' | t) : null">
          <app-input [disabled]="disabled()" [error]="nameRequiredError()" [value]="value().name" (valueChange)="onName($event)" (blurred)="blurName.emit()" />
        </app-form-field>

        <app-form-field [label]="('sequences.fields.prefix' | t)">
          <app-input [disabled]="disabled()" [value]="value().prefix ?? ''" (valueChange)="onPrefix($event)" />
        </app-form-field>
        <app-form-field [label]="('sequences.fields.suffix' | t)">
          <app-input [disabled]="disabled()" [value]="value().suffix ?? ''" (valueChange)="onSuffix($event)" />
        </app-form-field>

        <app-form-field [label]="('sequences.fields.step' | t)" [required]="true" [error]="stepRequiredError() ? ('validation.required' | t) : null">
          <app-input-number [disabled]="disabled()" [error]="stepRequiredError()" [min]="1" [allowDecimal]="false" [value]="value().step" (valueChange)="onStep($event)" (blurred)="blurStep.emit()" />
        </app-form-field>
        <app-form-field [label]="('sequences.fields.size' | t)" [required]="true" [error]="sizeRequiredError() ? ('validation.required' | t) : null">
          <app-input-number [disabled]="disabled()" [error]="sizeRequiredError()" [min]="1" [allowDecimal]="false" [value]="value().size" (valueChange)="onSize($event)" (blurred)="blurSize.emit()" />
        </app-form-field>

        <app-form-field [label]="('sequences.fields.next' | t)" [required]="true" [error]="nextRequiredError() ? ('validation.required' | t) : null">
          <app-input-number [disabled]="disabled()" [error]="nextRequiredError()" [min]="1" [allowDecimal]="false" [value]="value().next" (valueChange)="onNext($event)" (blurred)="blurNext.emit()" />
        </app-form-field>

        <div class="md:col-span-2">
          <label class="inline-flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" class="size-4 accent-primary" [checked]="value().active" (change)="onActive($any($event.target).checked)" />
            {{ 'sequences.fields.active' | t }}
          </label>
        </div>
      </div>
      <div class="mt-6 border border-token rounded-md p-4 bg-surface/50">
        <div class="text-sm font-medium mb-2">{{ 'sequences.patterns.title' | t }}</div>
        <ul class="text-sm space-y-1 text-muted">
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(year)s</code> — {{ 'sequences.patterns.year' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(y)s</code> — {{ 'sequences.patterns.y' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(month)s</code> — {{ 'sequences.patterns.month' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(weekday)s</code> — {{ 'sequences.patterns.weekday' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(day)s</code> — {{ 'sequences.patterns.day' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(doy)s</code> — {{ 'sequences.patterns.doy' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(woy)s</code> — {{ 'sequences.patterns.woy' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(h24)s</code> — {{ 'sequences.patterns.h24' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(min)s</code> — {{ 'sequences.patterns.min' | t }}</li>
          <li><code class="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-fg">%(sec)s</code> — {{ 'sequences.patterns.sec' | t }}</li>
        </ul>
      </div>
    </form>

  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class SequenceFormComponent {
  disabled = input<boolean>(false);

  nameRequiredError = input<boolean>(false);
  codeRequiredError = input<boolean>(false);
  stepRequiredError = input<boolean>(false);
  sizeRequiredError = input<boolean>(false);
  nextRequiredError = input<boolean>(false);

  value = model<SequenceFormValue>({
    code: '',
    name: '',
    step: 1,
    size: 5,
    next: 0,
    prefix: null,
    suffix: null,
    active: true
  });

  submit = output<SequenceFormValue>();
  cancel = output<void>();
  blurCode = output<void>();
  blurName = output<void>();
  blurStep = output<void>();
  blurSize = output<void>();
  blurNext = output<void>();

  onCode(v: string | null) {
    this.value.set({ ...this.value(), code: (v ?? '').toString() });
  }
  onName(v: string | null) {
    this.value.set({ ...this.value(), name: (v ?? '').toString() });
  }
  onPrefix(v: string | null) {
    this.value.set({ ...this.value(), prefix: (v ?? '').toString() });
  }
  onSuffix(v: string | null) {
    this.value.set({ ...this.value(), suffix: (v ?? '').toString() });
  }
  onStep(v: number | null) {
    this.value.set({ ...this.value(), step: v });
  }
  onSize(v: number | null) {
    this.value.set({ ...this.value(), size: v });
  }
  onNext(v: number | null) {
    this.value.set({ ...this.value(), next: v });
  }
  onActive(v: boolean) {
    this.value.set({ ...this.value(), active: v });
  }
}
