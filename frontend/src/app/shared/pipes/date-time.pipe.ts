import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../core/i18n/translate.service';

// Formats date and time according to active language
@Pipe({ name: 'appDateTime', standalone: true, pure: false })
export class AppDateTimePipe implements PipeTransform {
  constructor(private i18n: TranslateService) {}

  transform(value?: string | number | Date | null, options?: Intl.DateTimeFormatOptions): string {
    if (!value) return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';
    const locale = this.i18n.lang();
    const fmt = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      ...(options || {})
    });
    return fmt.format(date);
  }
}
