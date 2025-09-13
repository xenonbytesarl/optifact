import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/i18n/translate.service';

@Pipe({
  name: 'amountCurrency',
  standalone: true
})
export class AmountCurrencyPipe implements PipeTransform {
  private i18n = inject(TranslateService);

  transform(value: number | string | null | undefined, currency?: string, minimumFractionDigits: number = 2, maximumFractionDigits: number = 2): string {
    const n = typeof value === 'string' ? Number(value) : (value ?? 0);
    const val = isNaN(Number(n)) ? 0 : Number(n);
    const curr = (currency || 'EUR').toUpperCase();
    const locale = this.i18n.lang() || 'en';
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency: curr, minimumFractionDigits, maximumFractionDigits }).format(val);
    } catch {
      return `${val.toFixed(Math.max(0, minimumFractionDigits))} ${curr}`;
    }
  }
}
