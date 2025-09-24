import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../shared/ui/card';
import { ButtonComponent } from '../../../shared/ui/button';
import { InputHiddenComponent } from '../../../shared/ui/input-hidden';
import { userStore } from '../user.store';

@Component({
  selector: 'app-activate-account-form',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, InputHiddenComponent],
  template: `
    <div class="min-h-dvh flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <app-card>
          <div class="flex flex-col items-center mb-6">
            <img src="/assets/images/logo-black.png" alt="Logo" class="h-24 mb-2" />
            <h2 class="text-xl font-semibold">Activation du compte</h2>
          </div>

          <!-- Hidden fields for id & code (bound from route/query/inputs) -->
          <app-input-hidden [value]="id" (valueChange)="id = ($event ?? '')" />
          <app-input-hidden [value]="code" (valueChange)="code = ($event ?? '')" />

          @if (!success) {
            <div class="flex flex-col gap-4">
              <p class="text-sm text-gray-600">Cliquez sur le bouton ci-dessous pour activer votre compte.</p>
              <app-button type="button" variant="primary" [disabled]="store.loading() || !id || !code" (clicked)="onActivate()">
                @if (store.loading()) {
                  <span class="material-symbols-outlined mr-1 align-middle animate-spin">progress_activity</span>
                } @else {
                  <span class="material-symbols-outlined mr-1 align-middle">check_circle</span>
                }
                Activer mon compte
              </app-button>
              @if (error) {
                <p class="text-sm text-red-600">{{ error }}</p>
              }
            </div>
          } @else {
            <div class="rounded-md border border-green-200 bg-green-50 text-green-800 p-4">
              <p class="text-sm">
                Votre compte est activé. un lien qui expire dans 2 jours vous a été  envoyé par email pour definir votre mot de passe
              </p>
            </div>
            <div class="mt-4">
              <app-button variant="ghost" (clicked)="goToLogin()">
                <span class="material-symbols-outlined mr-1 align-middle">login</span>
                Se connecter
              </app-button>
            </div>
          }
        </app-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateAccountFormComponent {
  // Optional inputs fallback
  userId = input<string | null>(null);
  verificationCode = input<string | null>(null);

  id: string = '';
  code: string = '';
  success = false;
  error: string | null = null;

  readonly store = inject(userStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    const q = this.route.snapshot.queryParamMap;
    const p = this.route.snapshot.paramMap;
    const code = p.get('verificationCode') || q.get('code') || this.verificationCode();
    const id = p.get('userId') || q.get('id') || this.userId();
    if (code) this.code = code;
    if (id) this.id = id;
  }

  async onActivate() {
    this.error = null;
    const ok = await this.store.activateAccount(this.id, this.code);
    if (ok) {
      // Show fixed success message as per requirement
      this.success = true;
    } else {
      this.error = this.store.error() || 'Impossible d\'activer le compte. Veuillez réessayer.';
    }
  }

  goToLogin() {
    this.router.navigate(['/users', 'login']);
  }
}
