import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent, AutocompleteItem } from './autocomplete';
import { COUNTRIES } from './countries.data';

@Component({
  selector: 'app-country-autocomplete',
  standalone: true,
  imports: [CommonModule, AutocompleteComponent],
  template: `
    <app-autocomplete
      [items]="items()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [value]="value()"
      [rightSquare]="rightSquare()"
      [clearable]="clearable()"
      (valueChange)="value.set($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryAutocompleteComponent {
  placeholder = input<string>('Sélectionner un pays');
  disabled = input<boolean>(false);
  value = model<string | null>(null); // ISO alpha-2 code
  // when composed next to another input, allow squaring right corners
  rightSquare = input<boolean>(false);
  // allow toggling clear button visibility (pass-through)
  clearable = input<boolean>(true);
  // show only the flag as trigger (used by input-phone composition)
  flagOnly = input<boolean>(false);

  items = computed<AutocompleteItem[]>(() => {
    const fo = this.flagOnly();
    return COUNTRIES.map(c => ({ value: c.code, label: fo ? `${c.flag} ${c.code}` : `${c.flag} ${c.name}` }));
  });

}
