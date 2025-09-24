import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { InputPhoneComponent } from '../../../shared/ui/input-phone';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { RegisterUserRequest } from '../../../core/api/user.api';
import { CardComponent } from '../../../shared/ui/card';
import { TranslateService } from '../../../core/i18n/translate.service';
import { userStore } from '../user.store';
import { ToastService } from '../../../shared/ui/toast';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormFieldComponent, InputTextComponent, InputPhoneComponent, ButtonComponent, TranslatePipe, CardComponent],
  template: `
    <div class="min-h-dvh flex items-center justify-center px-4">
      <div class="w-full max-w-2xl">
        <app-card>
          <div class="flex flex-col items-center mb-6">
            <img src="/assets/images/logo-black.png" alt="Logo" class="h-24 mb-2" />
            <h2 class="text-xl font-semibold">{{ 'users.register' | t }}</h2>
          </div>

          @if (!success()) {
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">

            <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
              <span class="material-symbols-outlined text-[var(--color-primary)]">person</span>
              <span>{{ 'users.sections.user' | t }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-form-field [label]="'users.fields.firstname' | t">
                <app-input type="text" placeholder="John" [value]="firstname" (valueChange)="form.controls['firstname'].setValue($event)" />
              </app-form-field>
              <app-form-field [label]="'users.fields.lastname' | t" [required]="true" [error]="lastnameError()">
                <app-input type="text" placeholder="Doe" [error]="!!lastnameError()" [value]="lastname" (valueChange)="form.controls['lastname'].setValue($event)" (blurred)="form.controls['lastname'].markAsTouched()" />
              </app-form-field>
            </div>

            <div class="grid grid-cols-1 gap-4">
                <app-form-field [label]="'users.fields.email' | t" [required]="true" [error]="emailError()">
                  <app-input type="email" placeholder="user@email.com" [error]="!!emailError()" [value]="email" (valueChange)="form.controls['email'].setValue($event)" (blurred)="form.controls['email'].markAsTouched()" />
                </app-form-field>
                <app-form-field [label]="'users.fields.phone' | t" [required]="true" [error]="phoneError()">
                  <app-input-phone placeholder="+33 6 12 34 56 78" [error]="!!phoneError()" [value]="phone" (valueChange)="form.controls['phone'].setValue($event)" (blurred)="form.controls['phone'].markAsTouched()" />
                </app-form-field>
            </div>

            <div class="border-t border-[var(--color-border)]/50"></div>

            <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
              <span class="material-symbols-outlined text-[var(--color-primary)]">apartment</span>
              <span>{{ 'users.sections.actor' | t }}</span>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <app-form-field [label]="'users.fields.actorName' | t">
                <app-input type="text" placeholder="ACME Corp" [value]="actorName" (valueChange)="form.controls['actorName'].setValue($event)" />
              </app-form-field>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-form-field [label]="'users.fields.registrationNumber' | t" [error]="regOrTaxError()">
                <app-input type="text" placeholder="RCS 123 456 789" [error]="!!regOrTaxError()" [value]="registrationNumber" (valueChange)="form.controls['registrationNumber'].setValue($event)" (blurred)="form.controls['registrationNumber'].markAsTouched()" />
              </app-form-field>
              <app-form-field [label]="'users.fields.taxNumber' | t" [error]="regOrTaxError()">
                <app-input type="text" placeholder="FR12 345678901" [error]="!!regOrTaxError()" [value]="taxNumber" (valueChange)="form.controls['taxNumber'].setValue($event)" (blurred)="form.controls['taxNumber'].markAsTouched()" />
              </app-form-field>
            </div>

            <div class="flex items-center gap-3 mt-2">
              <app-button type="submit" [disabled]="store.loading() || form.invalid" variant="primary">
                @if (store.loading()) {
                  <span class="material-symbols-outlined mr-1 align-middle animate-spin">progress_activity</span>
                } @else {
                  <span class="material-symbols-outlined mr-1 align-middle">how_to_reg</span>
                }
                {{ 'users.register' | t }}
              </app-button>
            </div>

            <p class="text-sm text-muted mt-2 text-center pb-20">
              {{ 'users.alreadyHaveAccount' | t }}
              <a [routerLink]="['/users/login']" class="text-[var(--color-primary)] underline underline-offset-4">{{ 'users.fields.login' | t }}</a>
            </p>
          </form>
          } @else {
            <div class="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
              <span class="material-symbols-outlined text-5xl text-emerald-600">mark_email_read</span>
              <p class="text-base text-neutral-500 max-w-prose">{{ 'users.registerEmailLinkSent' | t }}</p>
              <a [routerLink]="['/users/login']" class="text-[var(--color-primary)] underline underline-offset-4">{{ 'users.fields.login' | t }}</a>
            </div>
          }
        </app-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  readonly i18n = inject(TranslateService);
  readonly store = inject(userStore);
  private toast = inject(ToastService);

  // Keep inputs for potential external use (not used when routed directly)
  loading = input<boolean>(false);
  error = input<string | null>(null);
  message = input<string | null>(null);

  // local flag to hide form on success and show message
  success = signal(false);

  submitted = output<RegisterUserRequest>();

  private fb = new FormBuilder();

  private regOrTaxValidator = (group: AbstractControl): ValidationErrors | null => {
    const reg = (group.get('registrationNumber')?.value || '').toString().trim();
    const tax = (group.get('taxNumber')?.value || '').toString().trim();
    return (reg.length > 0 || tax.length > 0) ? null : { regOrTaxRequired: true };
  };

  form: FormGroup = this.fb.group({
    firstname: [''],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    actorName: [''],
    registrationNumber: [''],
    taxNumber: [''],
  }, { validators: [this.regOrTaxValidator] });

  get firstname() { return this.form.controls['firstname']?.value ?? ''; }
  get lastname() { return this.form.controls['lastname']?.value ?? ''; }
  get email() { return this.form.controls['email']?.value ?? ''; }
  get phone() { return this.form.controls['phone']?.value ?? ''; }
  get actorName() { return this.form.controls['actorName']?.value ?? ''; }
  get registrationNumber() { return this.form.controls['registrationNumber']?.value ?? ''; }
  get taxNumber() { return this.form.controls['taxNumber']?.value ?? ''; }

  emailError() {
    const c = this.form.controls['email'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return this.i18n.t('validation.required');
    if (c.hasError('email')) return this.i18n.t('validation.email');
    return null;
  }

  lastnameError() {
    const c = this.form.controls['lastname'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return this.i18n.t('validation.required');
    return null;
  }

  phoneError() {
    const c = this.form.controls['phone'];
    if (!c.touched && !c.dirty) return null;
    if (c.hasError('required')) return this.i18n.t('validation.phoneRequired') || this.i18n.t('validation.required');
    return null;
  }

  regOrTaxError() {
    const regCtrl = this.form.controls['registrationNumber'];
    const taxCtrl = this.form.controls['taxNumber'];
    const groupHasError = this.form.hasError('regOrTaxRequired');
    const touched = (regCtrl.touched || regCtrl.dirty) || (taxCtrl.touched || taxCtrl.dirty);
    if (!touched) return null;
    return groupHasError ? (this.i18n.t('validation.registrationOrTaxRequired')) : null;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: RegisterUserRequest = this.form.value as RegisterUserRequest;
    // Emit for external listeners if any
    this.submitted.emit(payload);
    const ok = await this.store.register(payload);
    if (!ok) {
      // toast error (translated via i18n key if provided)
      this.toast.error(this.store.error() || 'common.error');
      return;
    }
    // ensure a default success message if backend did not provide one
    if (!this.store.message()) {
      (this.store as any).message?.set?.('users.registerEmailLinkSent');
    }
    // switch UI to success state (hide form and show message)
    this.success.set(true);
    // toast success for immediate feedback
    this.toast.success(this.store.message() || 'users.registerEmailLinkSent');
  }
}
