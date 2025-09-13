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
        <app-tabs [items]="tabItems()" [(active)]="activeTab">
          @if (activeTab === 'info') {
            <app-claim-form
              [disabled]="loading()"
              [value]="formValue()"
              [stateRequiredError]="stateHasError()"
              (valueChange)="onValueChange($event)"
            />
          }
          @if (activeTab === 'lines') {
            <app-claim-lines-tab [lines]="formValue().lines" />
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

  tabItems = computed<TabItem[]>(() => {
    this.i18n.lang();
    return [
      { id: 'info', label: this.i18n.t('claims.tabs.info') },
      { id: 'lines', label: this.i18n.t('claims.tabs.lines') }
    ];
  });
  activeTab: 'info' | 'lines' = 'info';

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
}
