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
import { ButtonComponent } from '../../../shared/ui/button';

export type ClaimFormModel = {
  reference: string | null;
  state: Claim['state'];
  actorId: string | null;
  productId: string | null;
  createdAt: Date | null;
  submitAt: Date | null;
  inInstructionAt: Date | null;
  instructionDoneAt: Date | null;
  instructionRejectedAt: Date | null;
  compliantAt: Date | null;
  agreementGrantedAt?: Date | null;
  agreementRefusedAt?: Date | null;
  agreementAdjournedAt?: Date | null;
  uploadStarted: boolean | null;
  uploadEnded: boolean | null;
  lines?: ClaimLine[];
};

@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormFieldComponent, InputHiddenComponent, AutocompleteComponent, ChevronStepperComponent, InputDateTimeComponent, ButtonComponent],
  template: `
    <form class="flex flex-col gap-3">
      <div class="grid grid-cols-3 items-center gap-2">
        <div class="flex col-span-1 gap-2">
          @if (value().uploadEnded && value().state === 'DRAFT') {
            <app-button icon="check_circle" tone="primary" variant="primary" size="sm" rounded="md" [label]="i18n.t('claims.actions.submit')" (clicked)="onSubmit()" />
          }
          @if (value().state === 'SUBMITTED') {
            <app-button icon="handyman" tone="primary" variant="primary" size="sm" rounded="md" [label]="i18n.t('claims.actions.instruction')" (clicked)="onToInstruction()" />
          }
          @if (value().state === 'IN_INSTRUCTION') {
            <app-button icon="done_all" tone="primary" variant="primary" size="sm" rounded="md" [label]="i18n.t('claims.actions.done.instruction')" (clicked)="onDoneInstruction()" />
          }
          @if (value().state === 'INSTRUCTION_REJECTED') {
            <app-button icon="stylus_note" tone="primary" variant="primary" size="sm" rounded="md" [label]="i18n.t('claims.actions.backDraft')" (clicked)="onBackToDraft()" />
          }
          @if (value().state === 'INSTRUCTION_DONE') {
            <app-button icon="all_match" tone="primary" variant="primary" size="sm" rounded="md" [label]="i18n.t('claims.actions.completeCompliant')" (clicked)="onCompleteCompliant()" />
          }
          @if (value().state === 'COMPLETE_COMPLIANT') {
            <app-button icon="verified_user" tone="primary" variant="success" size="sm" rounded="md" [label]="i18n.t('claims.actions.agreementGranted')" (clicked)="onAgreementGranted()" />
            <app-button icon="gpp_bad" tone="primary" variant="danger" size="sm" rounded="md" [label]="i18n.t('claims.actions.agreementRefused')" (clicked)="onAgreementRefused()" />
            <app-button icon="remove_moderator" tone="primary" variant="secondary" size="sm" rounded="md" [label]="i18n.t('claims.actions.agreementAdjourned')" (clicked)="onAgreementAdjourned()" />
          }
        </div>
        <div class="col-span-2">
          <app-chevron-stepper
            [steps]="steps()"
            [activeIndex]="activeStep()"
            size="md"
            textScale="xs"
            (stepSelected)="onStepSelected($event)"
          />
        </div>
      </div>

      <app-input-hidden [value]="value().reference" />
      <app-input-hidden [value]="value().state" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
       <div class="text-2xl font-bold">
         {{ value().reference === 'New'? i18n.t('claims.fields.referencePrefixNew'): i18n.t('claims.fields.referencePrefix') }}  {{ value().reference === 'New'? '': value().reference }}
       </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <app-form-field [label]="('claims.fields.actorName' | t)">
          <app-autocomplete
            [disabled]="disabled() || value().state !== 'DRAFT'"
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
            [disabled]="disabled() || value().state !== 'DRAFT'"
            [items]="productItems()"
            [placeholder]="('claims.fields.productName' | t)"
            [value]="value().productId"
            (valueChange)="onProductId($event)"
          />
        </app-form-field>
        <app-form-field [label]="('claims.fields.doneAt' | t)">
          <app-input-date-time [value]="value().instructionDoneAt" [disabled]="true" [clearable]="false"/>
        </app-form-field>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimFormComponent {
  // Stepper state: display claim statuses
  readonly i18n = inject(TranslateService);
  readonly statusOrder: Claim['state'][] = ['DRAFT', 'SUBMITTED', 'IN_INSTRUCTION','INSTRUCTION_REJECTED', 'INSTRUCTION_DONE', 'COMPLETE_COMPLIANT', 'AGREEMENT_GRANTED', 'AGREEMENT_REFUSED', 'AGREEMENT_ADJOURNED', 'CANCELLED'];

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
        case 'SUBMITTED': return 'send';
        case 'IN_INSTRUCTION': return 'rule';
        case 'INSTRUCTION_REJECTED': return 'done_all';
        case 'INSTRUCTION_DONE': return 'done_all';
        case 'COMPLETE_COMPLIANT': return 'task_alt';
        case 'AGREEMENT_GRANTED': return 'verified';
        case 'AGREEMENT_REFUSED': return 'block';
        case 'AGREEMENT_ADJOURNED': return 'schedule';
        case 'CANCELLED': return 'cancel';
        default: return '';
      }
    };
    const visibility = (s: string) => {
      switch (s) {
        case 'DRAFT': return true;
        case 'SUBMITTED': return true;
        case 'IN_INSTRUCTION': return true;
        case 'INSTRUCTION_DONE': return true;
        case 'INSTRUCTION_REJECTED': return false;
        case 'COMPLETE_COMPLIANT': return true;
        case 'AGREEMENT_GRANTED': return true;
        case 'AGREEMENT_REFUSED': return false;
        case 'AGREEMENT_ADJOURNED': return false;
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
  toInstruction = output<string>();
  doneInstruction = output<string>();
  backToDraft = output<string>();
  completeCompliant = output<string>();
  agreementGranted = output<string>();
  agreementRefused = output<string>();
  agreementAdjourned = output<string>();

  stateRequiredError = input<boolean>(false);


  constructor() {}

  onSubmit() {
    this.submit.emit('submit');
  }

  onToInstruction() {
    this.toInstruction.emit('instruction');
  }

  onDoneInstruction() {
    this.doneInstruction.emit('doneInstruction');
  }

  onBackToDraft() {
    this.backToDraft.emit('backToDraft');
  }

  onCompleteCompliant() {
    this.completeCompliant.emit('completeCompliant');
  }

  onAgreementGranted() {
    this.agreementGranted.emit('agreementGranted');
  }

  onAgreementRefused() {
    this.agreementRefused.emit('agreementRefused');
  }

  onAgreementAdjourned() {
    this.agreementAdjourned.emit('agreementAdjourned');
  }

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
      { value: 'SUBMITTED', label: this.i18n.t('claims.states.submit') },
      { value: 'IN_INSTRUCTION', label: this.i18n.t('claims.states.in_instruction') },
      { value: 'INSTRUCTION_REJECTED', label: this.i18n.t('claims.states.instruction_reject') },
      { value: 'INSTRUCTION_DONE', label: this.i18n.t('claims.states.instruction_done') },
      { value: 'COMPLETE_COMPLIANT', label: this.i18n.t('claims.states.complete_compliant') },
      { value: 'AGREEMENT_GRANTED', label: this.i18n.t('claims.states.agreement_granted') },
      { value: 'AGREEMENT_REFUSED', label: this.i18n.t('claims.states.agreement_refused') },
      { value: 'AGREEMENT_ADJOURNED', label: this.i18n.t('claims.states.agreement_adjourned') },
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
      submitAt: patch.submitAt !== undefined ? patch.submitAt : base.submitAt,
      inInstructionAt: patch.inInstructionAt !== undefined ? patch.inInstructionAt : base.inInstructionAt,
      instructionDoneAt: patch.instructionDoneAt !== undefined ? patch.instructionDoneAt : base.instructionDoneAt,
      compliantAt: patch.compliantAt !== undefined ? patch.compliantAt : base.compliantAt,
      agreementGrantedAt: patch.agreementGrantedAt !== undefined ? patch.agreementGrantedAt : base.agreementGrantedAt,
      agreementRefusedAt: patch.agreementRefusedAt !== undefined ? patch.agreementRefusedAt : base.agreementRefusedAt,
      agreementAdjournedAt: patch.agreementAdjournedAt !== undefined ? patch.agreementAdjournedAt : base.agreementAdjournedAt,
      uploadStarted: patch.uploadStarted !== undefined ? patch.uploadStarted : base.uploadStarted,
      uploadEnded: patch.uploadEnded !== undefined ? patch.uploadEnded : base.uploadEnded,
      lines: patch.lines !== undefined ? patch.lines! : (base.lines ?? [])
    } as ClaimFormModel;
  }

  onActorId(v: string | null) {
    const val = this.value();
    this.emit(this.next(val, { actorId: v || null }));
  }
  onProductId(v: string | null) {
    const val = this.value();
    this.emit(this.next(val, { productId: v || null }));
  }

}
