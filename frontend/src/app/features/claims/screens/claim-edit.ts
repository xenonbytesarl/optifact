import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { TranslateService } from '../../../core/i18n/translate.service';
import { ActivatedRoute } from '@angular/router';
import { useClaimScreen } from './claim-screen.util';
import { ClaimFormComponent } from '../components/claim-form';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { ClaimLinesTabComponent } from '../components/claim-lines-tab';
import { actorStore } from '../../actors/actors.store';
import { productStore } from '../../products/products.store';
import { AutocompleteItem } from '../../../shared/ui/autocomplete';
import { AttachmentTransfert, ClaimLine } from '../../../core/api/claim.api';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog';
import { ClaimLineRejectDialogComponent } from '../components/claim-line-reject-dialog';
import { ToastService } from '../../../shared/ui/toast';

@Component({
  selector: 'app-claim-edit-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, SpinnerComponent, ClaimFormComponent, TabsComponent, ClaimLinesTabComponent, ConfirmDialogComponent, ClaimLineRejectDialogComponent],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="loading()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="mb-4">
          <app-claim-form
            [disabled]="loading()"
            [value]="formValue()"
            [stateRequiredError]="stateHasError()"
            [actorItems]="actorItems()"
            [productItems]="productItems()"
            (valueChange)="onValueChange($event)"
            (submit)="onSubmit()"
            (toInstruction)="onToInstruction()"
            (doneInstruction)="onDoneInstruction()"
          />
        </div>
        <app-tabs [items]="tabItems()" [(active)]="activeTab">
          @if (activeTab === 'lines') {
            <app-claim-lines-tab
              [lines]="formValue().lines"
              [claimId]="claimId()"
              [loading]="loading()"
              [claimStatus]="formValue().state"
              (attachmentTransfert)="onUploadFile($event)"
              (attachementDownload)="download($event)"
              (validateClicked)="openValidateDialog($event)"
              (rejectClicked)="openRejectDialog($event)"

            />
          }
          @if (activeTab === 'audit') {
          }
        </app-tabs>
      </app-card>

      <!-- Validate confirmation dialog -->
      <app-confirm-dialog
        [(open)]="validateDialogOpen"
        [title]="i18n.t('claims.lines.validate.title')"
        [message]="i18n.t('claims.lines.validate.message')"
        [okLabel]="i18n.t('actions.validate')"
        [cancelLabel]="i18n.t('actions.cancel')"
        (decided)="onValidateDecided($event)"
      />

      <!-- Reject reason dialog -->
      <app-claim-line-reject-dialog
        [(open)]="rejectDialogOpen"
        [title]="i18n.t('claims.lines.reject.title')"
        [message]="i18n.t('claims.lines.reject.message')"
        [placeholder]="i18n.t('claims.lines.reject.placeholder')"
        [okLabel]="i18n.t('actions.reject')"
        [cancelLabel]="i18n.t('actions.cancel')"
        (confirm)="onRejectConfirm($event)"
        (cancelled)="onRejectCancelled()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimEditPage {
  // Dialog state for line validate/reject
  validateDialogOpen = signal(false);
  rejectDialogOpen = signal(false);
  // Prevent double API calls on fast double-clicks
  private validating = signal(false);
  selectedLine: ClaimLine | null = null;
  readonly route = inject(ActivatedRoute);
  ui = useClaimScreen();
  readonly i18n = inject(TranslateService);
  readonly actors = inject(actorStore);
  readonly products = inject(productStore);
  readonly toast = inject(ToastService);

  // Autocomplete items
  actorItems = computed<AutocompleteItem[]>(() => this.actors.actorPage().elements.map(a => ({
    value: a.id,
    label: a.reference ? `${a.name} (${a.reference})` : a.name
  })));

  productItems = computed<AutocompleteItem[]>(() => this.products.productPage().elements.map(p => ({
    value: p.id,
    label: p.code ? `${p.name} (${p.code})` : p.name
  })));

  claimId = computed(() => this.route.snapshot.paramMap.get('id') as string);

  tabItems = computed<TabItem[]>(() => {
    this.i18n.lang();
    return [
      { id: 'lines', label: this.i18n.t('claims.tabs.lines') },
      { id: 'audit', label: this.i18n.t('claims.tabs.audit') }
    ];
  });
  activeTab: 'audit' | 'lines' = 'lines';

  constructor() {
    effect(() => {
      this.ui.syncFromCurrentIfPristine();
    });
  }

  async onSubmit() {
    const id = this.claimId();
    if (!id || this.loading()) return;
    const ok = await this.ui.store.submitClaim(id);
    if (ok) {
      this.toast.success(this.ui.store.message() || this.i18n.t('claims.messages.submit.success'));
      await this.ui.store.findById(id);
    } else {
      this.toast.error(this.ui.store.error() || this.i18n.t('claims.messages.submit.error'));
    }
  }

  async onToInstruction() {
    const id = this.claimId();
    if (!id || this.loading()) return;
    const ok = await this.ui.store.toInstruction(id);
    if (ok) {
      this.toast.success(this.ui.store.message() || this.i18n.t('claims.messages.instruction.success'));
      await this.ui.store.findById(id);
    } else {
      this.toast.error(this.ui.store.error() || this.i18n.t('claims.messages.instruction.error'));
    }
  }

  async onDoneInstruction() {
    const id = this.claimId();
    if (!id || this.loading()) return;
    const ok = await this.ui.store.terminateInstruction(id);
    if (ok) {
      this.toast.success(this.ui.store.message() || this.i18n.t('claims.messages.instruction.done.success'));
      await this.ui.store.findById(id);
    } else {
      this.toast.error(this.ui.store.error() || this.i18n.t('claims.messages.instruction.done.error'));
    }
  }

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  stateHasError() { return this.ui.stateHasError(); }
  onValueChange(v: any) { return this.ui.onValueChange(v); }

  async save() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!id) return;
    return this.ui.saveEdit(id);
  }
  goBack() { return this.ui.goBack(); }

  async onUploadFile(attachmentTransfert: AttachmentTransfert) {
    const id = this.claimId();
    if (id) await this.ui.store.findById(id);
  }

  async download(attachmentId: string) {
    this.ui.store.downloadAttachment(this.claimId(), attachmentId);
  }

  openValidateDialog(line: ClaimLine) {
    this.selectedLine = line;
    this.validateDialogOpen.set(true);
  }

  async onValidateDecided(confirmed: boolean) {
    if (!confirmed || this.validating()) return;
    const id = this.claimId();
    const lineId = this.selectedLine?.id;
    if (!id || !lineId) return;
    try {
      this.validating.set(true);
      const ok = await this.ui.store.validateLine(id, lineId);
      if (ok) {
        await this.ui.store.findById(id);
      }
    } finally {
      this.validating.set(false);
    }
  }

  openRejectDialog(line: ClaimLine) {
    this.selectedLine = line;
    this.rejectDialogOpen.set(true);
  }

  async onRejectConfirm(reason: string) {
    const id = this.claimId();
    const lineId = this.selectedLine?.id;
    if (!id || !lineId) return;
    const ok = await this.ui.store.rejectLine(id, lineId, reason);
    if (ok) {
      await this.ui.store.findById(id);
    }
  }

  onRejectCancelled() {
    this.rejectDialogOpen.set(false);
  }
}
