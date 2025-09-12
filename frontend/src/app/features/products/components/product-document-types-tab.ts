import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { AutocompleteComponent, AutocompleteItem } from '../../../shared/ui/autocomplete';
import { ButtonComponent } from '../../../shared/ui/button';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { AttachmentType } from '../../../core/api/attachment-types.api';
import { TranslateService } from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-product-document-types-tab',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AutocompleteComponent, ButtonComponent, SpinnerComponent],
  template: `
    <div class="flex flex-col gap-4">
      @if (!readonly()) {
        <div class="flex flex-col md:flex-row md:items-end gap-2">
          <div class="flex-1">
            <app-autocomplete
              [disabled]="readonly()"
              [placeholder]="('products.docTypes.searchPlaceholder' | t)"
              [items]="attachmentTypeItems()"
              [value]="selectedTypeId()"
              (valueChange)="onSelectType($event)"
            />
          </div>
          <div>
            <app-button [disabled]="readonly() || !selectedTypeId()" (clicked)="addSelected()">
              <span class="material-symbols-outlined text-base">add</span>
              <span class="ml-1">{{ 'products.docTypes.add' | t }}</span>
            </app-button>
          </div>
        </div>
      }
      @if (errorMsg()) {
        <div class="text-xs text-red-600">{{ errorMsg() }}</div>
      }
      @if (selectedTypes().length === 0) {
        <div class="rounded border border-dashed border-token p-6 text-center text-sm text-muted">
          {{ 'products.docTypes.empty' | t }}
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-3">
          @for (t of selectedTypes(); track t.id) {
            <div class="rounded border border-token bg-surface p-4 shadow-sm focus-within:ring-1 ring-primary" tabindex="0" (keydown)="onCardKeydown($event, t)">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-neutral-600 dark:text-neutral-300">description</span>
                  <div class="font-medium">{{ t.name }}</div>
                </div>
               @if(!readonly()) {
                 <button class="text-red-600 hover:text-red-700 focus:outline-none" [disabled]="readonly()" (click)="removeType(t)" [attr.aria-label]="('common.actions.delete' | t)">
                   <span class="material-symbols-outlined text-base">delete</span>
                 </button>
               }
              </div>
            </div>
          }
        </div>
      }

      @if (loading()) {
        <app-spinner [overlay]="false" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductDocumentTypesTabComponent {
  readonly = input<boolean>(false);
  // bind selected ids with a parent form
  modelIds = model<string[] | null>(null);

  private i18n = inject(TranslateService);
  attachmentTypes = input<AttachmentType[]>([]);
  currentAttachmentTypes = input<AttachmentType[]>([]);
  loading = input<boolean>(false);

  // available attachment types as autocomplete items
  attachmentTypeItems = computed<AutocompleteItem[]>(() => {
    return this.attachmentTypes().map(at => ({ value: at.id, label: at.name }));
  });

  errorMsg = signal<string | null>(null);

  selectedTypeId = model<string | null>(null);
  selectedTypes = signal<AttachmentType[]>([]);

  constructor() {
    // hydrate from incoming modelIds if any
    effect(() => {
      const ids = this.modelIds();
      const all = this.currentAttachmentTypes().length > 0? this.currentAttachmentTypes():  this.attachmentTypes();
      console.log(ids, all);
      if (ids && ids.length > 0) {
        // first map those available in current page
        const mapped = ids.map(id => all.find(a => a.id === id)).filter(Boolean) as AttachmentType[];
        this.selectedTypes.set(mapped);
      } else if (!ids || ids.length === 0) {
        this.selectedTypes.set([]);
      }
    });
  }


  onSelectType(id: string | null) {
    this.selectedTypeId.set(id);
    this.errorMsg.set(null);
  }

  addSelected() {
    const id = this.selectedTypeId();
    if (!id) return;
    const found = this.attachmentTypes().find(x => x.id === id);
    if (!found) return;
    const exists = this.selectedTypes().some(x => x.id === id);
    if (exists) {
      this.errorMsg.set(this.i18n.t('products.docTypes.alreadyAssociated'));
      return;
    }
    this.selectedTypes.set([found, ...this.selectedTypes()]);
    // update modelIds
    const ids = [found.id, ...(this.modelIds() ?? [])].filter((v, i, arr) => arr.indexOf(v) === i);
    this.modelIds.set(ids);
    this.selectedTypeId.set(null);
    this.errorMsg.set(null);
  }

  removeType(t: AttachmentType) {
    this.selectedTypes.set(this.selectedTypes().filter(x => x.id !== t.id));
    const ids = (this.modelIds() ?? []).filter(id => id !== t.id);
    this.modelIds.set(ids);
  }

  onCardKeydown(ev: KeyboardEvent, t: AttachmentType) {
    if (this.readonly()) return;
    if (ev.key === 'Delete' || ev.key === 'Backspace') {
      ev.preventDefault();
      this.removeType(t);
    }
  }
}
