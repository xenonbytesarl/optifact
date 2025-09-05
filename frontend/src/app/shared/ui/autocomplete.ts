import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, effect, input, model, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AutocompleteItem { value: string; label: string; icon?: string } // icon can be emoji or text

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <div class="flex items-center gap-2 w-full h-11 border border-token bg-surface text-fg px-3 pr-9 text-base focus-within:ring-1 ring-primary shadow-sm relative">
        <input
          #inputEl
          type="text"
          [attr.placeholder]="placeholder() || null"
          [disabled]="disabled()"
          class="w-full h-full bg-transparent outline-none placeholder-muted"
          [value]="query()"
          (input)="onInput($event)"
          (focus)="open.set(true)"
          (keydown)="onKeydown($event)"
        />
        @if (clearable() && (query() || value())) {
          <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-fg p-1 h-6 w-6 inline-flex items-center justify-center" (click)="clear($event)">
            <span class="material-symbols-outlined text-sm leading-none">close</span>
          </button>
        }
        @if (!value() && !(clearable() && (query() || value()))) {
          <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none">expand_more</span>
        }
      </div>

      @if (open() && filtered().length) {
        <div class="absolute z-[60] mt-1 w-full  border border-token bg-surface shadow-lg max-h-60 overflow-auto">
          <ul role="listbox" [attr.aria-activedescendant]="activeId()">
            @for (item of filtered(); track item.value; let i = $index) {
              <li
                [id]="idFor(i)"
                role="option"
                (click)="select(item)"
                class="px-3 py-2 cursor-pointer flex items-center gap-2 text-sm hover:bg-muted/10"
                [class.bg-accent]="i === activeIndex()"
              >
                @if (item.icon) { <span class="text-base">{{ item.icon }}</span> }
                <span>{{ item.label }}</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent {
  items = input.required<AutocompleteItem[]>();
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  clearable = input<boolean>(true);
  value = model<string | null>(null);
  // when placed left of another input (e.g., phone), square the right corners
  rightSquare = input<boolean>(false);

  // internal state
  open = signal(false);
  query = signal('');
  activeIndex = signal<number>(-1);

  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const items = this.items();
    if (!q) return items;
    return items.filter(i => i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q));
  });

  activeId = computed(() => this.activeIndex() >= 0 ? this.idFor(this.activeIndex()) : null);

  constructor() {
    // keep the query in sync with the selected value initially
    effect(() => {
      const v = this.value();
      if (v == null) { return; }
      const found = this.items().find(i => i.value === v);
      if (found && !this.open()) {
        this.query.set(found.label);
      }
    });
  }

  idFor(i: number) { return `ac-option-${i}`; }

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.query.set(target.value);
    this.open.set(true);
    this.activeIndex.set(0);
  }

  select(item: AutocompleteItem) {
    this.value.set(item.value);
    this.query.set(item.label);
    this.open.set(false);
  }

  clear(e: Event) {
    e.stopPropagation();
    this.value.set(null);
    this.query.set('');
    this.activeIndex.set(-1);
    const el = this.inputEl();
    el?.nativeElement.focus();
  }

  onKeydown(e: KeyboardEvent) {
    if (!this.open()) {
      if (e.key === 'ArrowDown') { this.open.set(true); this.activeIndex.set(0); e.preventDefault(); }
      return;
    }
    const list = this.filtered();
    if (!list.length) return;
    const idx = this.activeIndex();
    if (e.key === 'ArrowDown') {
      const next = idx < list.length - 1 ? idx + 1 : 0;
      this.activeIndex.set(next);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      const prev = idx > 0 ? idx - 1 : list.length - 1;
      this.activeIndex.set(prev);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const sel = list[Math.max(0, this.activeIndex())];
      if (sel) this.select(sel);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      this.open.set(false);
      e.preventDefault();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    // close when clicking outside
    const host = (ev.target as HTMLElement)?.closest('app-autocomplete');
    // Using HostListener, we can't easily compare; fallback: if open and event target not inside any dropdown of this component, close.
    if (this.open()) {
      const input = this.inputEl()?.nativeElement;
      if (input && ev.target instanceof Node && !input.contains(ev.target)) {
        this.open.set(false);
      }
    }
  }
}
