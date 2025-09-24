import {ChangeDetectionStrategy, Component, inject, input, model, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LoginApiRequest } from '../../../core/api/user.api';
import {userStore} from '../user.store';
import { ToastService } from '../../../shared/ui/toast';
import {TranslateService} from '../../../core/i18n/translate.service';
import { CardComponent } from '../../../shared/ui/card';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormFieldComponent, InputTextComponent, ButtonComponent, TranslatePipe, CardComponent],
  template: `
    <div class="min-h-dvh flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <app-card>
          <div class="flex flex-col items-center mb-6">
            <img src="/assets/images/logo-black.png" alt="Logo" class="h-24 mb-2" />
            <h2 class="text-xl font-semibold">{{ 'users.login' | t }}</h2>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

            <app-form-field [label]="'users.fields.email' | t" [required]="true" [error]="emailError()">
              <app-input type="email" placeholder="user@email.com" [error]="(!!emailError())" [value]="email" (valueChange)="form.controls['email'].setValue($event)" (blurred)="form.controls['email'].markAsTouched()" />
            </app-form-field>

            <app-form-field [label]="'users.password' | t" [required]="true" [error]="passwordError()">
              <app-input type="password" placeholder="••••••••" [error]="!!passwordError()" [value]="password" (valueChange)="form.controls['password'].setValue($event)" (blurred)="form.controls['password'].markAsTouched()" />
            </app-form-field>

            <div class="flex items-center gap-3 mt-2">
              <app-button type="submit" [disabled]="store.loading() || form.invalid" variant="primary">
                @if (store.loading()) {
                  <span class="material-symbols-outlined mr-1 align-middle animate-spin">progress_activity</span>
                } @else {
                  <span class="material-symbols-outlined mr-1 align-middle">login</span>
                }
                {{ 'users.fields.login' | t }}
              </app-button>
            </div>

            <p class="text-sm text-muted mt-4 text-center pb-20">
              {{ 'users.noAccountQuestion' | t }}
              <a [routerLink]="['/users/register']" class="text-[var(--color-primary)] underline underline-offset-4">{{ 'users.createAccount' | t }}</a>
            </p>
          </form>
        </app-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  readonly i18n = inject(TranslateService);
  // Store-driven state; keep inputs defined for compatibility though template uses store signals.
  loading = input<boolean>(false);
  error = input<string | null>(null);
  message = input<string | null>(null);

  submitted = output<LoginApiRequest>();
  cancel = output<void>();

  readonly store = inject(userStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  private fb = new FormBuilder();
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required /*, Validators.minLength(6)*/]],
  });

  get email() { return this.form.controls['email']?.value ?? ''; }
  get password() { return this.form.controls['password']?.value ?? ''; }

  emailError() {
    const c = this.form.controls['email'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return this.i18n.t('validation.required');
    if (c.hasError('email')) return this.i18n.t('validation.email');
    return null;
  }

  passwordError() {
    const c = this.form.controls['password'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return this.i18n.t('validation.required');
    return null;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: LoginApiRequest = {
      email: this.form.value.email,
      password: this.form.value.password,
    } as LoginApiRequest;

    // Emit for any external listeners
    this.submitted.emit(payload);

    // Call API via store and route accordingly
    const result = await this.store.login(payload);
    if (result) {
      // Show success toast and go to MFA verification screen
      this.toast.success(this.store.message() || 'users.login.success');
      const emailToUse = (result as any)?.email ?? payload.email;
      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
      this.router.navigate(['/users/verify-mfa'], { queryParams: { email: emailToUse, ...(redirectTo ? { redirectTo } : {}) } });
    } else {
      // Error case
      this.toast.error(this.store.error() || 'users.login.error');
    }
  }
}
