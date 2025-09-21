import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-user-screen',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="flex flex-col gap-6">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-3xl text-primary">group</span>
          <div>
            <h1 class="text-xl font-semibold">{{ title() }}</h1>
            @if (subtitle()) {
              <p class="text-sm text-muted">{{ subtitle() }}</p>
            }
          </div>
        </div>
        <div class="flex items-center gap-2">
          @if (showBack()) {
            <button type="button" class="h-10 px-4 rounded border border-token hover:bg-muted/10" (click)="back.emit()">
              <span class="material-symbols-outlined align-middle mr-1">arrow_back</span>
              {{ 'common.back' | t }}
            </button>
          }
          @if (showSave()) {
            <button type="button" class="h-10 px-4 rounded bg-primary text-white hover:bg-primary/90" (click)="save.emit()">
              <span class="material-symbols-outlined align-middle mr-1">save</span>
              {{ 'common.save' | t }}
            </button>
          }
        </div>
      </header>
      <section>
        <ng-content></ng-content>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserScreenComponent {
  title = input<string>('');
  subtitle = input<string>('');
  showBack = input<boolean>(true);
  showSave = input<boolean>(true);

  back = output<void>();
  save = output<void>();
}
