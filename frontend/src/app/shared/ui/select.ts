import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption { value: string; label: string }

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select [disabled]="disabled()"
            class="w-full rounded-lg border border-token bg-surface text-fg px-3 py-2 text-sm outline-none focus:ring-2 ring-primary shadow-sm"
            [value]="value() ?? ''"
            (change)="onChange($event)">
      <option *ngIf="placeholder()" value="">{{ placeholder() }}</option>
      <option *ngFor="let o of options()" [value]="o.value">{{ o.label }}</option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent {
  options = input.required<SelectOption[]>();
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  value = model<string | null>(null);

  onChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value.set(target.value || null);
  }
}
