import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: TranslateService, private cdr: ChangeDetectorRef) {}
  transform(key: string, params?: Record<string, string | number>): string {
    // Recompute on language signal changes by poking change detection
    // Since the pipe is impure, it will be checked each CD run.
    return this.i18n.t(key, params);
  }
}
