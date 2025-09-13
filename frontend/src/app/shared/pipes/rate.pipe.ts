import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/i18n/translate.service';

@Pipe({
  name: 'rate',
  standalone: true
})
export class RatePipe implements PipeTransform {
  private i18n = inject(TranslateService);
  transform(value: number | string | null | undefined, fractionDigits: number = 2): string {
    const n = typeof value === 'string' ? Number(value) : (value ?? 0);
    const val = isNaN(Number(n)) ? 0 : Number(n);
    const locale = this.i18n.lang() || 'en';
    try {
      return `${new Intl.NumberFormat(locale, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(val)} %`;
    } catch {
      return `${val.toFixed(Math.max(0, fractionDigits))} %`;
    }
  }
}
