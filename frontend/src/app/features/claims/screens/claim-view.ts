import {ChangeDetectionStrategy, Component, computed, effect, inject, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { TranslateService } from '../../../core/i18n/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { useClaimScreen } from './claim-screen.util';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { AppDateTimePipe } from '../../../shared/pipes/date-time.pipe';
import { ClaimLinesTabComponent } from '../components/claim-lines-tab';
import { actorStore } from '../../actors/actors.store';
import { productStore } from '../../products/products.store';
import { AutocompleteItem } from '../../../shared/ui/autocomplete';
import { ChevronStepperComponent, Step as ChevronStep } from '../../../shared/ui/chevron-stepper';
import {ClaimState} from '../../../core/api/claim.api';
import {ClaimFormModel} from '../components/claim-form';

@Component({
  selector: 'app-claim-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, SpinnerComponent, TabsComponent, ClaimLinesTabComponent, AppDateTimePipe, ChevronStepperComponent],
  template: `
    <app-action-bar
      [showSave]="false"
      [showCancel]="false"
      (editClicked)="goEdit()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="mb-6">
          <app-chevron-stepper
            [steps]="steps()"
            [activeIndex]="activeStep()"
            size="md"
            textScale="sm"
            (stepSelected)="$event"
          />
          <div class="text-2xl font-bold mt-3 mb-3">{{ i18n.t('claims.fields.referencePrefix') }} {{ formValue().reference || '' }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div class="text-xs text-muted">{{ i18n.t('claims.fields.actorName') }}</div>
              <div class="text-sm font-medium">{{ actorLabel(formValue().actorId) || '—' }}</div>
            </div>
            <div>
              <div class="text-xs text-muted">{{ i18n.t('claims.fields.createdAt') }}</div>
              <div class="text-sm font-medium">{{ formValue().createdAt | appDateTime }}</div>
            </div>
            <div>
              <div class="text-xs text-muted">{{ i18n.t('claims.fields.productName') }}</div>
              <div class="text-sm font-medium">{{ productLabel(formValue().productId) || '—' }}</div>
            </div>
            <div>
              <div class="text-xs text-muted">{{ i18n.t('claims.fields.doneAt') }}</div>
              <div class="text-sm font-medium">{{ formValue().instructionDoneAt | appDateTime }}</div>
            </div>
          </div>
        </div>
        <app-tabs [items]="tabItems()" [(active)]="activeTab">
          @if (activeTab === 'lines') {
            <app-claim-lines-tab [lines]="formValue().lines" [readOnly]="true" [claimStatus]="formValue().state" />
          }
          @if (activeTab === 'audit') {
          }
        </app-tabs>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimViewPage {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  ui = useClaimScreen();
  readonly i18n = inject(TranslateService);
  readonly actors = inject(actorStore);
  readonly products = inject(productStore);

  // Autocomplete items (used for labels only)
  actorItems = computed<AutocompleteItem[]>(() => this.actors.actorPage().elements.map(a => ({
    value: a.id,
    label: a.reference ? `${a.name} (${a.reference})` : a.name
  })));

  productItems = computed<AutocompleteItem[]>(() => this.products.productPage().elements.map(p => ({
    value: p.id,
    label: p.code ? `${p.name} (${p.code})` : p.name
  })));

  valueChange = output<ClaimFormModel>();
  submit = output<string>();
  toInstruction = output<string>();
  doneInstruction = output<string>();

  // Stepper state for read-only view
  readonly statusOrder: Array<ClaimState> = [
    'DRAFT', 'SUBMITTED', 'IN_INSTRUCTION', 'INSTRUCTION_REJECTED', 'INSTRUCTION_DONE', 'COMPLETE_COMPLIANT', 'AGREEMENT_GRANTED', 'AGREEMENT_REFUSED', 'AGREEMENT_ADJOURNED', 'CANCELLED'
  ];

  activeStep = computed(() => {
    const state = (this.formValue().state as any) as string;
    const idx = this.statusOrder.indexOf(state as any);
    return idx >= 0 ? idx : 0;
  });

  steps = computed<ChevronStep[]>(() => {
    // depend on lang to recompute labels
    this.i18n.lang();
    const active = this.activeStep();
    const labelFor = (s: string) => {
      switch (s) {
        case 'DRAFT': return this.i18n.t('claims.states.draft');
        case 'SUBMITTED': return this.i18n.t('claims.states.submit');
        case 'IN_INSTRUCTION': return this.i18n.t('claims.states.in_instruction');
        case 'INSTRUCTION_REJECTED': return this.i18n.t('claims.states.instruction_reject');
        case 'INSTRUCTION_DONE': return this.i18n.t('claims.states.instruction_done');
        case 'COMPLETE_COMPLIANT': return this.i18n.t('claims.states.complete_compliant');
        case 'AGREEMENT_GRANTED': return this.i18n.t('claims.states.agreement_granted');
        case 'AGREEMENT_REFUSED': return this.i18n.t('claims.states.agreement_refused');
        case 'AGREEMENT_ADJOURNED': return this.i18n.t('claims.states.agreement_adjourned');
        case 'CANCELLED': return this.i18n.t('claims.states.cancelled');
        default: return s;
      }
    };

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
      label: labelFor(s),
      completed: idx < active,
      icon: iconFor(s),
      disabled: true,
      visible: visibility(s),
    }));
  });

  tabItems = computed<TabItem[]>(() => {
    this.i18n.lang();
    return [
      { id: 'lines', label: this.i18n.t('claims.tabs.lines') },
      { id: 'audit', label: this.i18n.t('claims.tabs.audit') }
    ];
  });
  activeTab: 'audit' | 'lines' = 'lines';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ui.store.findById(id);
    }
    effect(() => {
      this.ui.syncFromCurrentIfPristine();
    });
  }

  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  actorLabel(id: string | null | undefined): string | null {
    const item = this.actorItems().find(a => a.value === id);
    return item?.label ?? null;
  }
  productLabel(id: string | null | undefined): string | null {
    const item = this.productItems().find(p => p.value === id);
    return item?.label ?? null;
  }

  goBack() { return this.ui.goBack(); }
  goEdit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.router.navigate(['/claims', id, 'edit']);
  }
}
