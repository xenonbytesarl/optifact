import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  template: `
    <textarea
      [attr.placeholder]="placeholder() || null"
      [disabled]="disabled()"
      [rows]="rows()"
      (input)="onInput($event)"
      class="w-full  border border-token bg-surface text-fg placeholder-muted px-3 py-2 text-sm outline-none focus:ring-2 ring-primary shadow-sm resize-y"
    >{{ value() ?? '' }}</textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent {
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  rows = input<number>(4);
  value = model<string | null>(null);

  onInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }
}
