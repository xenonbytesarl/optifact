import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import { Invoice, InvoiceLine } from '../../../core/api/invoice.api';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputHiddenComponent } from '../../../shared/ui/input-hidden';
import { AutocompleteComponent, AutocompleteItem } from '../../../shared/ui/autocomplete';
import { InputDateTimeComponent } from '../../../shared/ui/input-date-time';
//
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { InvoiceTabComponent } from './invoice-tab';
import {InputTextComponent} from '../../../shared/ui/input';

export type InvoiceFormModel = {
  reference: string | null;
  state: Invoice['state'];
  actorId: string | null;
  claimId: string | null;
  createdAt: Date | null;
  sendAt: Date | null;
  issueAt: Date | null;
  amount: string | null;
  amountCurrency: string | null;
  lines: InvoiceLine[];
};

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormFieldComponent, InputHiddenComponent, AutocompleteComponent, InputDateTimeComponent, TabsComponent, InvoiceTabComponent, InputTextComponent],
  template: `
    <form class="flex flex-col gap-3">
      <app-input-hidden [value]="value().reference" />
      <app-input-hidden [value]="value().state" />
      <app-input-hidden [value]="value().amountCurrency" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="text-2xl font-bold">{{ value().reference }}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <app-form-field [label]="('invoices.fields.actor' | t)" [required]="true" [error]="actorErrorVisible() ? ('invoices.validation.actorRequired' | t) : null">
          <app-autocomplete
            [disabled]="disabled()"
            [items]="actorItems()"
            [placeholder]="('invoices.fields.actor' | t)"
            [value]="value().actorId"
            (valueChange)="onActorId($event)"
          />
        </app-form-field>
        <app-form-field [label]="('invoices.fields.createdAt' | t)">
          <app-input-date-time [value]="value().createdAt" [disabled]="true" [clearable]="false" />
        </app-form-field>
        <app-form-field [label]="('invoices.fields.issueAt' | t)">
          <app-input-date-time [value]="value().issueAt" [disabled]="true" (valueChange)="onIssueAt($event)" [clearable]="false" />
        </app-form-field>
        <app-form-field [label]="('invoices.fields.sendAt' | t)">
          <app-input-date-time [value]="value().sendAt" [disabled]="true" (valueChange)="onSendAt($event)" [clearable]="false" />
        </app-form-field>
        @if (showClaimField()) {
          <app-form-field [label]="('invoices.fields.claim' | t)">
            <app-input [disabled]="true"  [value]="value().claimId" />
          </app-form-field>
        }
      </div>

      <div class="mt-4">
        @if (linesErrorVisible()) {
          <div class="mb-2 text-xs text-red-600">{{ 'invoices.validation.linesRequired' | t }}</div>
        }
        <app-tabs [items]="tabItems()" [(active)]="activeTab"></app-tabs>
        @if (activeTab === 'lines') {
          <app-invoice-tab
            [lines]="value().lines"
            [productItems]="productItems()"
            [disabled]="disabled()"
            [addDisabled]="addDisabled() || disabled()"
            (add)="onAddClicked()"
            (edit)="onEditLine($event)"
            (remove)="onRemoveLine($event)"
          />
        }
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class InvoiceFormComponent {
  readonly i18n = inject(TranslateService);

  disabled = input<boolean>(false);
  // Disable Add line button independently of overall form disabled state
  addDisabled = input<boolean>(false);
  value = input.required<InvoiceFormModel>();
  actorItems = input<AutocompleteItem[]>([]);
  productItems = input<AutocompleteItem[]>([]);

  // Edit-only claims reference display
  showClaimField = input<boolean>(false);
  claimReference = input<string | null>(null);

  // Validation helpers
  actorError = computed<boolean>(() => !this.value()?.actorId);
  linesError = computed<boolean>(() => !(this.value()?.lines && this.value()!.lines.length > 0));

  // Touched flags to control when to show validation
  actorTouched = signal(false);
  linesTouched = signal(false);

  // Visible errors: only when touched
  actorErrorVisible = computed<boolean>(() => this.actorTouched() && this.actorError());
  linesErrorVisible = computed<boolean>(() => this.linesTouched() && this.linesError());

  // Tabs state
  tabItems = computed<TabItem[]>(() => {
    this.i18n.lang();
    return [
      { id: 'lines', label: this.i18n.t('invoices.tabs.lines') }
    ];
  });
  activeTab: 'lines' = 'lines';

  valueChange = output<InvoiceFormModel>();
  requestAddLine = output<void>();
  requestEditLine = output<InvoiceLine>();

  onRemoveLine(line: InvoiceLine) {
    const idx = (this.value().lines || []).findIndex(l => (l.id && line.id && l.id === line.id) || (!l.id && !line.id && l.name === line.name));
    if (idx >= 0) {
      this.removeLine(idx);
    }
  }

  onEditLine(line: InvoiceLine) {
    this.requestEditLine.emit(line);
  }

  constructor() {}

  private next(base: InvoiceFormModel, patch: Partial<InvoiceFormModel>): InvoiceFormModel {
    return {
      reference: patch.reference !== undefined ? patch.reference : base.reference,
      state: (patch.state as any) ?? base.state,
      actorId: patch.actorId !== undefined ? patch.actorId : base.actorId,
      claimId: patch.claimId !== undefined ? patch.claimId : base.claimId,
      createdAt: patch.createdAt !== undefined ? patch.createdAt : base.createdAt,
      sendAt: patch.sendAt !== undefined ? patch.sendAt : base.sendAt,
      issueAt: patch.issueAt !== undefined ? patch.issueAt : base.issueAt,
      amount: patch.amount !== undefined ? patch.amount : base.amount,
      amountCurrency: patch.amountCurrency != undefined? patch.amountCurrency: base.amountCurrency,
      lines: patch.lines !== undefined ? patch.lines! : (base.lines ?? []),
    } as InvoiceFormModel;
  }

  emit(v: InvoiceFormModel) {
    this.valueChange.emit(v);
  }

  onActorId(v: string | null) {
    this.actorTouched.set(true);
    const val = this.value();
    this.emit(this.next(val, { actorId: v || null }));
  }
  onIssueAt(v: Date | null) {
    const val = this.value();
    this.emit(this.next(val, { issueAt: v || null }));
  }
  onSendAt(v: Date | null) {
    const val = this.value();
    this.emit(this.next(val, { sendAt: v || null }));
  }
  removeLine(index: number) {
    this.linesTouched.set(true);
    const val = this.value();
    const lines = [...(val.lines || [])];
    lines.splice(index, 1);
    this.emit(this.next(val, { lines }));
  }

  onAddClicked() {
    this.linesTouched.set(true);
    this.requestAddLine.emit();
  }
}
