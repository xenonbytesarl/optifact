import {ChangeDetectionStrategy, Component, inject, input, output, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import { Claim, ClaimLine } from '../../../core/api/claim.api';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { SelectOption } from '../../../shared/ui/select';
import { InputHiddenComponent } from '../../../shared/ui/input-hidden';
import { AutocompleteComponent, AutocompleteItem } from '../../../shared/ui/autocomplete';
import { ChevronStepperComponent, Step as ChevronStep } from '../../../shared/ui/chevron-stepper';
import { InputDateTimeComponent } from '../../../shared/ui/input-date-time';

export type ClaimFormModel = {
  reference: string | null;
  state: Claim['state'];
  actorId: string | null;
  productId: string | null;
  createdAt: Date | null;
  doneAt: Date | null;
  lines?: ClaimLine[];
};

@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormFieldComponent, InputHiddenComponent, AutocompleteComponent, ChevronStepperComponent, InputDateTimeComponent],
  template: `
    <form class="flex flex-col gap-3">


      <app-chevron-stepper
        [steps]="steps()"
        [activeIndex]="activeStep()"
        size="lg"
        (stepSelected)="onStepSelected($event)"
      />

      <app-input-hidden [value]="value().reference" />
      <app-input-hidden [value]="value().state" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
       <div class="text-2xl font-bold">
         {{ value().reference }}
       </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <app-form-field [label]="('claims.fields.actorName' | t)">
          <app-autocomplete
            [disabled]="disabled()"
            [items]="actorItems()"
            [placeholder]="('claims.fields.actorName' | t)"
            [value]="value().actorId"
            (valueChange)="onActorId($event)"
          />
        </app-form-field>
        <app-form-field [label]="('claims.fields.createdAt' | t)">
          <app-input-date-time [value]="value().createdAt" [disabled]="true" [clearable]="false"  />
        </app-form-field>
        <app-form-field [label]="('claims.fields.productName' | t)">
          <app-autocomplete
            [disabled]="disabled()"
            [items]="productItems()"
            [placeholder]="('claims.fields.productName' | t)"
            [value]="value().productId"
            (valueChange)="onProductId($event)"
          />
        </app-form-field>
        <app-form-field [label]="('claims.fields.doneAt' | t)">
          <app-input-date-time [value]="value().doneAt" [disabled]="true" [clearable]="false"/>
        </app-form-field>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimFormComponent {
  // Stepper state: display claim statuses
  private i18n = inject(TranslateService);
  readonly statusOrder: Claim['state'][] = ['DRAFT','SUBMIT','IN_INSTRUCTION','REJECT','VALIDATED','DONE','CANCELLED'];

  activeStep = computed(() => {
    const state = this.value().state as Claim['state'];
    const idx = this.statusOrder.indexOf(state);
    return idx >= 0 ? idx : 0;
  });

  steps = computed<ChevronStep[]>(() => {
    // depend on lang to recompute labels
    this.i18n.lang();
    const active = this.activeStep();
    const labels = this.stateOptions();
    const findLabel = (s: string) => labels.find(o => o.value === s)?.label || s;
    const iconFor = (s: string) => {
      switch (s) {
        case 'DRAFT': return 'draft';
        case 'SUBMIT': return 'send';
        case 'IN_INSTRUCTION': return 'rule';
        case 'REJECT': return 'cancel';
        case 'VALIDATED': return 'task_alt';
        case 'DONE': return 'done_all';
        case 'CANCELLED': return 'block';
        default: return '';
      }
    };
    const visibility = (s: string) => {
      switch (s) {
        case 'DRAFT': return true;
        case 'SUBMIT': return true;
        case 'IN_INSTRUCTION': return true;
        case 'REJECT': return false;
        case 'VALIDATED': return true;
        case 'DONE': return true;
        case 'CANCELLED': return false;
        default: return false;
      }
    };
    return this.statusOrder.map((s, idx) => ({
      id: s,
      label: findLabel(s),
      completed: idx < active,
      icon: iconFor(s),
      disabled: false,
      visible: visibility(s),
    }));
  });


  disabled = input<boolean>(false);
  value = input.required<ClaimFormModel>();
  actorItems = input<AutocompleteItem[]>([]);
  productItems = input<AutocompleteItem[]>([]);

  valueChange = output<ClaimFormModel>();
  submit = output<string>();

  stateRequiredError = input<boolean>(false);


  constructor() {}

  onStepSelected(i: number) {
    const nextState = this.statusOrder[i] as Claim['state'];
    if (!nextState) return;
    const val = this.value();
    this.emit(this.next(val, { state: nextState as any }));
  }

  stateOptions(): SelectOption[] {
    // depend on lang so labels reflect current language
    this.i18n.lang();
    return [
      { value: 'DRAFT', label: this.i18n.t('claims.states.draft') },
      { value: 'SUBMIT', label: this.i18n.t('claims.states.submit') },
      { value: 'IN_INSTRUCTION', label: this.i18n.t('claims.states.in_instruction') },
      { value: 'REJECT', label: this.i18n.t('claims.states.reject') },
      { value: 'VALIDATED', label: this.i18n.t('claims.states.validated') },
      { value: 'DONE', label: this.i18n.t('claims.states.done') },
      { value: 'CANCELLED', label: this.i18n.t('claims.states.cancelled') },
    ];
  }

  emit(v: ClaimFormModel) {
    this.valueChange.emit(v);
  }

  private next(base: ClaimFormModel, patch: Partial<ClaimFormModel>): ClaimFormModel {
    return {
      reference: patch.reference !== undefined ? patch.reference : base.reference,
      state: (patch.state as any) ?? base.state,
      actorId: patch.actorId !== undefined ? patch.actorId : base.actorId,
      productId: patch.productId !== undefined ? patch.productId : base.productId,
      createdAt: patch.createdAt !== undefined ? patch.createdAt : base.createdAt,
      doneAt: patch.doneAt !== undefined ? patch.doneAt : base.doneAt,
      lines: patch.lines !== undefined ? patch.lines! : (base.lines ?? [])
    } as ClaimFormModel;
  }

  onReference(v: string | null) {
    const val = this.value();
    this.emit(this.next(val, { reference: v ?? '' }));
  }
  onState(v: string | null) {
    const val = this.value();
    this.emit(this.next(val, { state: v as any }));
  }
  onActorId(v: string | null) {
    const val = this.value();
    this.emit(this.next(val, { actorId: v || null }));
  }
  onProductId(v: string | null) {
    const val = this.value();
    this.emit(this.next(val, { productId: v || null }));
  }
  onDoneAt(v: Date | null) {
    const val = this.value();
    this.emit(this.next(val, { doneAt: v || null }));
  }
}
