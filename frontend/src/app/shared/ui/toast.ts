import { ChangeDetectionStrategy, Component, Signal, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeout: number; // ms
}

// Simple toast store/service using signals
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 1;
  private _items = signal<Toast[]>([]);
  readonly items = this._items.asReadonly();

  show(message: string, type: ToastType = 'info', timeout = 3000) {
    const id = this.seq++;
    const toast: Toast = { id, type, message, timeout };
    this._items.update((arr) => [...arr, toast]);
    if (timeout > 0) {
      setTimeout(() => this.dismiss(id), timeout);
    }
    return id;
  }

  info(msg: string, timeout = 3000) { return this.show(msg, 'info', timeout); }
  success(msg: string, timeout = 3000) { return this.show(msg, 'success', timeout); }
  warning(msg: string, timeout = 4000) { return this.show(msg, 'warning', timeout); }
  error(msg: string, timeout = 5000) { return this.show(msg, 'error', timeout); }

  dismiss(id: number) {
    this._items.update((arr) => arr.filter((t) => t.id !== id));
  }

  clear() { this._items.set([]); }
}

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-2 pointer-events-none">
      @for (t of items(); track t.id) {
        <div class="pointer-events-auto min-w-64 max-w-[90vw] md:max-w-xl  px-4 py-3 shadow-lg border text-sm flex items-start gap-3"
             [class.bg-emerald-50]="t.type==='success'" [class.text-emerald-900]="t.type==='success'" [class.border-emerald-200]="t.type==='success'"
             [class.bg-sky-50]="t.type==='info'" [class.text-sky-900]="t.type==='info'" [class.border-sky-200]="t.type==='info'"
             [class.bg-amber-50]="t.type==='warning'" [class.text-amber-900]="t.type==='warning'" [class.border-amber-200]="t.type==='warning'"
             [class.bg-rose-50]="t.type==='error'" [class.text-rose-900]="t.type==='error'" [class.border-rose-200]="t.type==='error'">
          <div class="pt-0.5">
            <span class="material-symbols-outlined" [class.text-emerald-700]="t.type==='success'" [class.text-sky-700]="t.type==='info'" [class.text-amber-700]="t.type==='warning'" [class.text-rose-700]="t.type==='error'">
              {{ icon(t.type) }}
            </span>
          </div>
          <div class="flex-1">
            {{ t.message }}
          </div>
          <button type="button" (click)="dismiss(t.id)" class="ml-2 text-xs text-muted hover:underline">Fermer</button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastsComponent {
  private svc = inject(ToastService);
  items = this.svc.items;

  icon = (type: ToastType) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  dismiss(id: number) { this.svc.dismiss(id); }
}

// Helper to provide a singleton service at root if preferred
export function provideToastService() {
  return [ToastService];
}
