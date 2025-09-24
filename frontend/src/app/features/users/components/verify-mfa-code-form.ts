import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { InputOtpComponent } from '../../../shared/ui/input-otp';
import { CardComponent } from '../../../shared/ui/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import { userStore } from '../user.store';
import {TranslateService} from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-verify-mfa-code-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent, TranslatePipe, InputOtpComponent, CardComponent],
  template: `
    <div class="min-h-dvh flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <app-card>
          <div class="flex flex-col items-center mb-6">
            <img src="/assets/images/logo-black.png" alt="Logo" class="h-24 mb-2" />
            <h2 class="text-xl font-semibold">{{ 'users.mfa.verifyTitle' | t }}</h2>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <!-- Email is hidden but kept in form -->
            <input type="hidden" formControlName="email" />


            <p class="text-sm text-neutral-600 dark:text-neutral-300 text-center">
              <span class="material-symbols-outlined text-5xl text-emerald-600">mark_email_read</span><br/>
              {{ 'users.mfa.info' | t }}
            </p>

            <app-form-field [label]="'users.mfa.code' | t" [required]="true" [error]="codeError()">
              <app-input-otp [digits]="digits" mode="number" [value]="code" (valueChange)="form.controls['code'].setValue($event)" (blurred)="form.controls['code'].markAsTouched()" />
            </app-form-field>

            <div class="flex items-center gap-3 mt-2">
              <app-button type="submit" [disabled]="store.loading() || form.controls['code'].invalid" variant="primary">
                @if (store.loading()) {
                  <span class="material-symbols-outlined mr-1 align-middle animate-spin">progress_activity</span>
                } @else {
                  <span class="material-symbols-outlined mr-1 align-middle">verified_user</span>
                }
                {{ 'users.mfa.check' | t }}
              </app-button>
            </div>

            <p class="text-sm text-center mt-2 text-neutral-600 dark:text-neutral-300 pb-20">
              {{ 'users.mfa.lostCodeQuestion' | t }}
              <a [routerLink]="['.']" [queryParams]="{ resend: true }" queryParamsHandling="merge" class="text-[var(--color-primary)] underline underline-offset-4">
                {{ 'users.mfa.requestNew' | t }}
              </a>
            </p>
          </form>
        </app-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyMfaCodeFormComponent {

  readonly i18n = inject(TranslateService);

  // Config
  digits = 6;

  // Inputs kept for compatibility (not used directly)
  loading = input<boolean>(false);
  error = input<string | null>(null);
  message = input<string | null>(null);

  submitted = output<{ email: string; code: string }>();

  readonly store = inject(userStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  private fb = new FormBuilder();
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(this.digits)]],
  });

  constructor() {
    // Prefill email from query params or from store.auth
    const qEmail = this.route.snapshot.queryParamMap.get('email');
    const sEmail = (this.store.auth() as any)?.email as string | undefined;
    const email = qEmail || sEmail || '';
    if (email) {
      this.form.controls['email'].setValue(email);
    }
  }

  get email() { return this.form.controls['email']?.value ?? ''; }
  get code() { return this.form.controls['code']?.value ?? ''; }

  codeError() {
    const c = this.form.controls['code'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return  this.i18n.t('validation.required');
    if (c.hasError('minlength')) return  this.i18n.t('validation.required');
    return null;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, code } = this.form.value as { email: string; code: string };
    this.submitted.emit({ email, code });
    const result = await this.store.verifyMfaCode(email, code);
    if (result && (result as any).accessToken) {
      this.toast.success(this.store.message() || this.i18n.t('users.mfa.verify.success'));
      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
      if (redirectTo) {
        this.router.navigateByUrl(redirectTo);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.toast.error(this.store.error() || this.i18n.t('users.mfa.verify.error'));
    }
  }
}
