import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
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
import {attachmentTypeStore} from '../../attachment-type/attachment-type.store';
import {AttachmentTransfert} from '../../../core/api/claim.api';

@Component({
  selector: 'app-claim-edit-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, SpinnerComponent, ClaimFormComponent, TabsComponent, ClaimLinesTabComponent],
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
          />
        </div>
        <app-tabs [items]="tabItems()" [(active)]="activeTab">
          @if (activeTab === 'lines') {
            <app-claim-lines-tab
              [lines]="formValue().lines"
              [claimId]="claimId()"
              [loading]="loading()"
              (attachmentTransfert)="onUploadFile($event)"
              (attachementDownload)="download($event)"
            />
          }
          @if (activeTab === 'audit') {
          }
        </app-tabs>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimEditPage {
  readonly route = inject(ActivatedRoute);
  ui = useClaimScreen();
  private i18n = inject(TranslateService);
  readonly actors = inject(actorStore);
  readonly products = inject(productStore);

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
}
