import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog';
import { ButtonComponent } from './button';
import { TranslateService } from '../../core/i18n/translate.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent, ButtonComponent],
  template: `
    <app-dialog [title]="titleText()" [(open)]="open" [backdropClosable]="false" [panelMaxWidth]="panelMaxWidth()">
      <div class="text-sm">
        {{ messageText() }}
      </div>
      <div dialog-actions>
        <app-button variant="secondary" [label]="cancelText()" (click)="onCancel()" />
        <app-button class="ml-2" variant="danger" [label]="okText()" (click)="onConfirm()" />
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  private i18n = inject(TranslateService);

  // Optional custom text; fallbacks use i18n
  title = input<string>('');
  message = input<string>('');
  okLabel = input<string>('');
  cancelLabel = input<string>('');
  // Optional: allow setting a fixed max width on the inner dialog panel, e.g. '480px'
  panelMaxWidth = input<string | null>('360px');

  open = model<boolean>(false);
  decided = output<boolean>();

  titleText = computed(() => this.title() || this.i18n.t('confirm.title'));
  messageText = computed(() => this.message() || this.i18n.t('confirm.message.default'));
  okText = computed(() => this.okLabel() || this.i18n.t('confirm.ok'));
  cancelText = computed(() => this.cancelLabel() || this.i18n.t('confirm.cancel'));

  onCancel() {
    this.open.set(false);
    this.decided.emit(false);
  }
  onConfirm() {
    this.open.set(false);
    this.decided.emit(true);
  }
}

// Helper service to open programmatically and await result
import { ApplicationRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  open(options?: { title?: string; message?: string; okLabel?: string; cancelLabel?: string; panelMaxWidth?: string }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const cmpRef = createComponent(ConfirmDialogComponent, {
        environmentInjector: this.injector,
        hostElement: host
      });

      // Attach view for change detection before setting inputs
      this.appRef.attachView(cmpRef.hostView);

      // open and set inputs
      if (options?.title) cmpRef.setInput('title', options.title);
      if (options?.message) cmpRef.setInput('message', options.message);
      if (options?.okLabel) cmpRef.setInput('okLabel', options.okLabel);
      if (options?.cancelLabel) cmpRef.setInput('cancelLabel', options.cancelLabel);
      if (options?.panelMaxWidth) cmpRef.setInput('panelMaxWidth', options.panelMaxWidth);
      cmpRef.setInput('open', true);

      const sub = cmpRef.instance.decided.subscribe((val) => {
        cleanup();
        resolve(val);
      });

      const cleanup = () => {
        try { sub.unsubscribe(); } catch {}
        this.appRef.detachView(cmpRef.hostView);
        cmpRef.destroy();
        host.remove();
      };
    });
  }
}
