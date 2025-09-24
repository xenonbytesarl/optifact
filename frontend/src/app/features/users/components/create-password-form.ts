import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { CreateUserPasswordRequest } from '../../../core/api/user.api';
import { InputHiddenComponent } from '../../../shared/ui/input-hidden';
import { InputPasswordComponent } from '../../../shared/ui/input-password';
import { CardComponent } from '../../../shared/ui/card';
import { ActivatedRoute, Router } from '@angular/router';
import { userStore } from '../user.store';
import { ToastService } from '../../../shared/ui/toast';
import {TranslateService} from '../../../core/i18n/translate.service';

function matchPasswordsValidator(): ValidatorFn {
  return (group: AbstractControl) => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password !== confirm ? { mismatch: true } : null;
  };
}

@Component({
  selector: 'app-create-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, ButtonComponent, TranslatePipe, InputPasswordComponent, CardComponent, InputHiddenComponent],
  template: `
    <div class="min-h-dvh flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <app-card>
          <div class="flex flex-col items-center mb-6">
            <img src="/assets/images/logo-black.png" alt="Logo" class="h-24 mb-2" />
            <h2 class="text-xl font-semibold">{{ 'users.password.create.title' | t }}</h2>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <!-- Hidden fields for code and email -->
            <app-input-hidden [value]="id" (valueChange)="form.controls['userId'].setValue($event)" />
            <app-input-hidden [value]="code" (valueChange)="form.controls['code'].setValue($event)" />

            <app-form-field [label]="'users.password.new' | t" [required]="true" [error]="passwordError()">
              <app-input-password placeholder="••••••••" [error]="!!passwordError()" [value]="password" (valueChange)="form.controls['password'].setValue($event)" (blurred)="form.controls['password'].markAsTouched()" />
            </app-form-field>

            <app-form-field [label]="'users.password.confirm' | t" [required]="true" [error]="confirmError()">
              <app-input-password placeholder="••••••••" [error]="!!confirmError()" [value]="confirmPassword" (valueChange)="form.controls['confirmPassword'].setValue($event)" (blurred)="form.controls['confirmPassword'].markAsTouched()" />
            </app-form-field>

            @if (form.errors?.['mismatch']) {
              <p class="text-sm text-red-600">{{ 'validation.password.mismatch' | t }}</p>
            }

            <div class="flex items-center gap-3 mt-2 pb-15">
              <app-button type="submit" [disabled]="store.loading() || form.invalid" variant="primary">
                @if (store.loading()) {
                  <span class="material-symbols-outlined mr-1 align-middle animate-spin">progress_activity</span>
                } @else {
                  <span class="material-symbols-outlined mr-1 align-middle">key</span>
                }
                {{ 'users.password.confirm' | t }}
              </app-button>
            </div>
          </form>
        </app-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePasswordFormComponent {
  readonly i18n = inject(TranslateService);
  // legacy inputs kept for compatibility, prefer query params
  userId = input<string | null>(null);
  verificationCode = input<string | null>(null);
  loading = input<boolean>(false);
  error = input<string | null>(null);
  message = input<string | null>(null);

  submitted = output<CreateUserPasswordRequest>();

  readonly store = inject(userStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  private fb = new FormBuilder();
  form: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: matchPasswordsValidator() });

  constructor() {
    const q = this.route.snapshot.queryParamMap;
    const p = this.route.snapshot.paramMap;
    const code = p.get('verificationCode') || q.get('code') || this.verificationCode();
    const id = p.get('userId') || q.get('id') || this.userId();
    if (code) this.form.controls['code'].setValue(code);
    if (id) this.form.controls['id'].setValue(id);
  }


  get id() { return this.form.controls['id']?.value ?? ''; }
  get code() { return this.form.controls['code']?.value ?? ''; }
  get password() { return this.form.controls['password']?.value ?? ''; }
  get confirmPassword() { return this.form.controls['confirmPassword']?.value ?? ''; }

  passwordError() {
    const c = this.form.controls['password'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return this.i18n.t('validation.required');
    if (c.hasError('minlength')) return this.i18n.t('validation.password.minlength');
    return null;
  }

  confirmError() {
    const c = this.form.controls['confirmPassword'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return this.i18n.t('validation.required');
    return null;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { id, code, password, confirmPassword } = this.form.value as { id: string; code: string; password: string; confirmPassword: string };


    if (!id) {
      this.toast.error('users.password.create.noUser');
      return;
    }

    const ok = await this.store.createPassword(id, code, { password, confirmPassword });
    if (ok) {
      this.toast.success(this.store.message() || 'users.password.create.success');
      this.router.navigate(['/users', 'login']);
    } else {
      this.toast.error(this.store.error() || 'users.password.create.error');
    }
  }
}
