import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" (click)="onBackdrop()"></div>
        <div class="relative bg-surface border border-token shadow-xl w-full mx-4 max-w-full sm:max-w-[420px] md:max-w-[640px] lg:max-w-[800px] xl:max-w-[960px] 2xl:max-w-[1100px] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col overflow-y-auto" [style.maxWidth]="panelMaxWidth() || null">
          @if (title()) {
            <div class="px-4 py-3 border-b border-token shrink-0">
              <h3 class="text-base font-semibold">{{ title() }}</h3>
            </div>
          }
          <div class="p-4 overflow-visible flex-1 min-h-0">
            <ng-content />
          </div>
          <div class="px-4 py-3 border-t border-token flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end shrink-0">
            <ng-content select="[dialog-actions]" />
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'dialog', '[attr.aria-modal]': 'open() ? true : null' }
})
export class DialogComponent {
  title = input<string>('');
  open = model<boolean>(false);
  backdropClosable = input<boolean>(true);
  closed = output<void>();
  // Optional: allow overriding panel max width (e.g., '480px', '36rem')
  panelMaxWidth = input<string | null>(null);

  onBackdrop() {
    if (this.backdropClosable()) {
      this.open.set(false);
      this.closed.emit();
    }
  }
}
