import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { settingStore } from '../setting.store';
import { CardComponent } from '../../../shared/ui/card';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { DialogComponent } from '../../../shared/ui/dialog';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { ToastService } from '../../../shared/ui/toast';
import {MailServerState} from '../../../core/api/setting.api';

@Component({
  selector: 'app-setting-view-page',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslatePipe, SpinnerComponent, ActionBarComponent, ButtonComponent, DialogComponent, FormFieldComponent, InputTextComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="p-4 space-y-4">
      @if (loading()) { <app-spinner [overlay]="true" label="Chargement…" /> }

      <app-action-bar [showNew]="false" [showCancel]="false" [showSave]="false" (editClicked)="onEdit()" />

      @if (setting()) {
        <!-- Tabs header -->
        <div class="sticky top-[4.25rem] z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-token">
          <div class="px-4 mt-4">
            <nav class="flex items-end gap-4" role="tablist" aria-label="Settings tabs">
              <button type="button"
                      (click)="activeTab.set('company')"
                      [class]="'pb-2 text-sm md:text-base border-b-2 -mb-px transition ' + (activeTab() === 'company' ? 'border-[var(--color-primary)] text-fg' : 'border-transparent text-muted hover:text-fg')"
                      role="tab" [attr.aria-selected]="activeTab() === 'company'">
                {{ 'settings.sections.company' | t }}
              </button>
              <button type="button"
                      (click)="activeTab.set('email')"
                      [class]="'pb-2 text-sm md:text-base border-b-2 -mb-px transition ' + (activeTab() === 'email' ? 'border-[var(--color-primary)] text-fg' : 'border-transparent text-muted hover:text-fg')"
                      role="tab" [attr.aria-selected]="activeTab() === 'email'">
                {{ 'settings.sections.email' | t }}
              </button>
            </nav>
          </div>
        </div>

        <!-- COMPANY TAB -->
        @if (activeTab() === 'company') {
          <!-- Company section -->
          <app-card [title]="'settings.sections.company' | t">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div class="col-span-2 space-y-3">
                <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'settings.company.name' | t }}</span><span class="font-medium">{{ setting()?.company?.name }}</span></div>
                <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'settings.company.presidentId' | t }}</span><span>{{ setting()?.company?.presidentId || '-' }}</span></div>
                <div class="flex items-center gap-2"><span class="text-muted min-w-32">Logo</span><span>{{ setting()?.company?.logoFilename || '-' }}</span></div>
              </div>
              <div class="col-span-1">
                <div class="w-32 h-32 border border-token bg-neutral-50 dark:bg-neutral-900 grid place-items-center overflow-hidden rounded">
                  @if (setting()?.company?.logoFilename) {
                    <img [src]="'/assets/images/' + setting()?.company?.logoFilename" alt="Logo" class="object-contain w-full h-full" />
                  } @else {
                    <span class="text-sm text-muted">{{ 'settings.company.noLogo' | t }}</span>
                  }
                </div>
              </div>
            </div>
          </app-card>

          <!-- Address section -->
          <app-card [title]="'settings.sections.address' | t">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'address.street' | t }}</span><span class="font-medium">{{ setting()?.company?.address?.street || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'address.city' | t }}</span><span class="font-medium">{{ setting()?.company?.address?.city || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'address.zipCode' | t }}</span><span class="font-medium">{{ setting()?.company?.address?.zipCode || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'address.country' | t }}</span><span class="font-medium">{{ setting()?.company?.address?.country || '-' }}</span></div>
              <div class="flex items-center gap-2 md:col-span-2"><span class="text-muted min-w-32">{{ 'address.website' | t }}</span><span class="font-medium">{{ setting()?.company?.address?.website || '-' }}</span></div>
            </div>
          </app-card>

          <!-- Contact section -->
          <app-card [title]="'settings.sections.contact' | t">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'contact.name' | t }}</span><span class="font-medium">{{ setting()?.company?.contact?.name || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'contact.email' | t }}</span><span class="font-medium">{{ setting()?.company?.contact?.email || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'contact.phone' | t }}</span><span class="font-medium">{{ setting()?.company?.contact?.phone || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'contact.function' | t }}</span><span class="font-medium">{{ setting()?.company?.contact?.function || '-' }}</span></div>
            </div>
          </app-card>

          <!-- Bank section -->
          <app-card [title]="'settings.sections.bank' | t">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-2"><span class="text-muted min-w-40">{{ 'bank.owner' | t }}</span><span class="font-medium">{{ setting()?.company?.bankAccount?.bankAccountOwner || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-40">{{ 'bank.name' | t }}</span><span class="font-medium">{{ setting()?.company?.bankAccount?.bankName || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-40">{{ 'bank.code' | t }}</span><span class="font-medium">{{ setting()?.company?.bankAccount?.bankCode || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-40">{{ 'bank.counter' | t }}</span><span class="font-medium">{{ setting()?.company?.bankAccount?.bankCounter || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-40">{{ 'bank.number' | t }}</span><span class="font-medium">{{ setting()?.company?.bankAccount?.bankAccountNumber || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-40">{{ 'bank.key' | t }}</span><span class="font-medium">{{ setting()?.company?.bankAccount?.bankAccountKey || '-' }}</span></div>
            </div>
          </app-card>
        }

        <!-- EMAIL TAB -->
        @if (activeTab() === 'email') {
          <app-card [title]="'settings.sections.email' | t">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'email.from' | t }}</span><span class="font-medium">{{ setting()?.emailServer?.from || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'email.type' | t }}</span><span class="font-medium">{{ setting()?.emailServer?.type || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">{{ 'email.state' | t }}</span><span class="font-medium">{{ setting()?.emailServer?.state || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">Host</span><span class="font-medium">{{ setting()?.emailServer?.host || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">Port</span><span class="font-medium">{{ setting()?.emailServer?.port || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">Protocol</span><span class="font-medium">{{ setting()?.emailServer?.protocol || '-' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">TLS</span><span class="font-medium">{{ setting()?.emailServer?.useTLS ? 'Oui' : 'Non' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">Auth</span><span class="font-medium">{{ setting()?.emailServer?.useAuth ? 'Oui' : 'Non' }}</span></div>
              <div class="flex items-center gap-2"><span class="text-muted min-w-32">Username</span><span class="font-medium">{{ setting()?.emailServer?.username || '-' }}</span></div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2 py-6">
              @if (setting()?.emailServer?.state === MailServerState.NEW) {
                <app-button size="sm" variant="primary" tone="primary" icon="forward_to_inbox" [label]="('settings.email.sendCode' | t) || 'Envoyer le code de vérification'" [disabled]="loading()" (clicked)="onSendVerification()" />
              }
              @if (setting()?.emailServer?.state === MailServerState.WAITING) {
                <app-button size="sm" variant="secondary" tone="primary" icon="verified" [label]="('settings.email.verifyServer' | t) || 'Vérifier le serveur'" [disabled]="loading()" (clicked)="openCodeDialog()" />
              }
            </div>

            <!-- Code verification dialog -->
            <app-dialog [title]="('settings.email.enterCode' | t) || 'Entrer le code de vérification'" [(open)]="showCodeDialog" [backdropClosable]="true" (closed)="onDialogClosed()" panelMaxWidth="480px">
              <div class="space-y-4">
                <app-form-field [label]="('settings.email.code' | t) || 'Code'">
                  <app-input [(value)]="verificationCode" placeholder="Code de vérification" />
                </app-form-field>
              </div>
              <div dialog-actions>
                <app-button variant="ghost" [label]="('common.cancel' | t) || 'Annuler'" (clicked)="closeDialog()" />
                <app-button class="ml-2" variant="primary" tone="primary" icon="check" [label]="('common.validate' | t) || 'Valider'" [disabled]="!verificationCode() || loading()" (clicked)="submitCode()" />
              </div>
            </app-dialog>
          </app-card>
        }
      } @else {
        <app-card>
          <div class="text-center text-muted">{{ 'settings.empty' | t }}</div>
        </app-card>
      }
    </div>
  `
})
export class SettingViewPage {
  private store = inject(settingStore);
  private router = inject(Router);
  private toast = inject(ToastService);
  setting = computed(() => this.store.current());
  loading = computed(() => this.store.loading());
  activeTab = signal<'company' | 'email'>('company');

  // Dialog state for entering verification code
  showCodeDialog = signal(false);
  verificationCode = signal('');

  onEdit() {
    this.router.navigate(['/settings/edit']);
  }

  async onSendVerification() {
    const id = this.setting()?.id;
    if (!id) return;
    const res = await this.store.verifyMailServer(id);
    if (res) {
      this.toast.success(this.store.message() || 'Code de vérification envoyé');
    } else {
      this.toast.error(this.store.error() || 'Erreur lors de l\'envoi du code');
    }
  }

  openCodeDialog() {
    this.verificationCode.set('');
    this.showCodeDialog.set(true);
  }

  closeDialog() {
    this.showCodeDialog.set(false);
  }

  onDialogClosed() {
    this.verificationCode.set('');
  }

  async submitCode() {
    const id = this.setting()?.id;
    const code = (this.verificationCode() || '').trim();
    if (!id || !code) return;
    const res = await this.store.validateMailServer(id, code);
    if (res) {
      this.toast.success(this.store.message() || 'Serveur email vérifié avec succès');
      this.showCodeDialog.set(false);
      this.verificationCode.set('');
    } else {
      this.toast.error(this.store.error() || 'Code invalide ou expiré');
    }
  }

  protected readonly MailServerState = MailServerState;
}
