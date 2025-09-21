import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { settingStore } from '../setting.store';
import { CardComponent } from '../../../shared/ui/card';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { SelectComponent, SelectOption } from '../../../shared/ui/select';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { MailServerType } from '../../../core/api/setting.api';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CountryAutocompleteComponent } from '../../../shared/ui/country-autocomplete';
import { InputPhoneComponent } from '../../../shared/ui/input-phone';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import { COUNTRIES } from '../../../shared/ui/countries.data';

@Component({
  selector: 'app-setting-edit-page',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslatePipe, FormFieldComponent, InputTextComponent, SelectComponent, SpinnerComponent, ActionBarComponent, CountryAutocompleteComponent, InputPhoneComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <form class="p-4 space-y-4">
      @if (loading()) { <app-spinner [overlay]="true" label="Chargement…" /> }

      <app-action-bar [showNew]="false" [showEdit]="false" [disableSave]="loading() || hasErrors()" (cancelClicked)="onCancel()" (saveClicked)="onSubmit()" />

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
            <div class="col-span-2 grid grid-cols-1 gap-4">
              <app-form-field [label]="'settings.company.name' | t" [required]="true">
                <app-input [(value)]="companyName" placeholder="Nom de l'entreprise" />
              </app-form-field>
              <app-form-field [label]="'settings.company.presidentId' | t">
                <app-input [(value)]="presidentId" placeholder="UUID" />
              </app-form-field>
            </div>
            <div class="col-span-1 space-y-2">
              <div class="text-sm font-medium">{{ 'settings.company.logo' | t }}</div>
              <div class="w-40 h-40 border border-token bg-neutral-50 dark:bg-neutral-900 grid place-items-center overflow-hidden rounded">
                @if (logoPreview()) {
                  <img [src]="logoPreview()" alt="Aperçu logo" class="object-contain w-full h-full" />
                } @else if(logoFilename()) {
                  <img [src]="'/assets/images/' + logoFilename()" alt="Aperçu logo" class="object-contain w-full h-full" />
                } @else {
                  <span class="text-sm text-muted">{{ 'settings.company.noLogo' | t }}</span>
                }
              </div>
              <div class="flex items-center gap-2">
                <input type="file" accept="image/*" (change)="onLogoSelected($event)" class="block w-full text-sm" />
              </div>
              <p class="text-xs text-muted">PNG, JPG, SVG. Taille conseillée: 256x256. Le backend d'upload sera intégré ultérieurement.</p>
            </div>
          </div>
        </app-card>

        <!-- Address section -->
        <app-card [title]="'settings.sections.address' | t">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-form-field [label]="'address.street' | t"><app-input [(value)]="street" /></app-form-field>
            <app-form-field [label]="'address.city' | t"><app-input [(value)]="city" /></app-form-field>
            <app-form-field [label]="'address.zipCode' | t"><app-input [(value)]="zipCode" /></app-form-field>
            <app-form-field [label]="'address.country' | t"><app-country-autocomplete [(value)]="country" /></app-form-field>
            <app-form-field [label]="'address.website' | t" [hint]="'Ex: https://exemple.com'" [error]="websiteError()">
                          <app-input [(value)]="website" placeholder="https://" [error]="!!websiteError()" />
                        </app-form-field>
          </div>
        </app-card>

        <!-- Contact section -->
        <app-card [title]="'settings.sections.contact' | t">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-form-field [label]="'contact.name' | t"><app-input [(value)]="contactName" /></app-form-field>
            <app-form-field [label]="'contact.email' | t" [error]="contactEmailError()">
                          <app-input type="email" [(value)]="contactEmail" [error]="!!contactEmailError()" />
                        </app-form-field>
            <app-form-field [label]="'contact.phone' | t">
                          <app-input-phone [(value)]="contactPhone" [(country)]="country" />
                        </app-form-field>
            <app-form-field [label]="'contact.function' | t"><app-input [(value)]="contactFunction" /></app-form-field>
          </div>
        </app-card>

        <!-- Bank section -->
        <app-card [title]="'settings.sections.bank' | t">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-form-field [label]="'bank.owner' | t"><app-input [(value)]="bankOwner" /></app-form-field>
            <app-form-field [label]="'bank.name' | t"><app-input [(value)]="bankName" /></app-form-field>
            <app-form-field [label]="'bank.code' | t"><app-input [(value)]="bankCode" /></app-form-field>
            <app-form-field [label]="'bank.counter' | t"><app-input [(value)]="bankCounter" /></app-form-field>
            <app-form-field [label]="'bank.number' | t"><app-input [(value)]="bankNumber" /></app-form-field>
            <app-form-field [label]="'bank.key' | t"><app-input [(value)]="bankKey" /></app-form-field>
          </div>
        </app-card>
      }

      <!-- EMAIL TAB -->
      @if (activeTab() === 'email') {
        <app-card [title]="'settings.sections.email' | t">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <app-form-field [label]="'email.from' | t" [error]="emailFromError()">
                          <app-input type="email" [(value)]="emailFrom" [error]="!!emailFromError()" />
                        </app-form-field>
            <app-form-field [label]="'email.type' | t">
              <app-select [options]="emailTypeOptions" [(value)]="emailType" placeholder="Type" />
            </app-form-field>
            <app-form-field [label]="'email.host' | t"><app-input [(value)]="emailHost" /></app-form-field>
            <app-form-field [label]="'email.port' | t"><app-input type="number" [(value)]="emailPort" /></app-form-field>
            <app-form-field [label]="'email.protocol' | t"><app-input [(value)]="emailProtocol" /></app-form-field>
            <app-form-field [label]="'email.username' | t" [error]="emailUsernameError()">
                          <app-input type="email" [(value)]="emailUsername" [error]="!!emailUsernameError()" />
                        </app-form-field>
            <div class="md:col-span-3 flex flex-wrap items-center gap-4 text-sm text-muted">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" [checked]="emailUseTLS()" (change)="onToggleTLS($event)" /> {{ 'email.tls' | t }}
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" [checked]="emailUseAuth()" (change)="onToggleAuth($event)" /> {{ 'email.auth' | t }}
              </label>
            </div>
          </div>
        </app-card>
      }
    </form>
  `
})
export class SettingEditPage {
  private store = inject(settingStore);
  private router = inject(Router);
  private toast = inject(ToastService);
  // Pre-load current setting into signals
  private current = computed(() => this.store.current());
  loading = computed(() => this.store.loading());
  activeTab = signal<'company' | 'email'>('company');

  // Company
  companyName = signal<string | null>(this.current()?.company?.name ?? '');
  presidentId = signal<string | null>(this.current()?.company?.presidentId ?? '');
  logoFilename = signal<string | null>(this.current()?.company?.logoFilename ?? '');
  logoFile = signal<File | null>(null);
  logoPreview = signal<string | null>(null);

  // Address
  street = signal<string | null>(this.current()?.company?.address?.street ?? '');
  city = signal<string | null>(this.current()?.company?.address?.city ?? '');
  country = signal<string | null>(this.current()?.company?.address?.country ?? '');
  zipCode = signal<string | null>(this.current()?.company?.address?.zipCode ?? '');
  website = signal<string | null>(this.current()?.company?.address?.website ?? '');

  // Contact
  contactName = signal<string | null>(this.current()?.company?.contact?.name ?? '');
  contactEmail = signal<string | null>(this.current()?.company?.contact?.email ?? '');
  contactPhone = signal<string | null>(this.current()?.company?.contact?.phone ?? '');
  contactFunction = signal<string | null>(this.current()?.company?.contact?.function ?? '');

  // Bank
  bankOwner = signal<string | null>(this.current()?.company?.bankAccount?.bankAccountOwner ?? '');
  bankName = signal<string | null>(this.current()?.company?.bankAccount?.bankName ?? '');
  bankCode = signal<string | null>(this.current()?.company?.bankAccount?.bankCode ?? '');
  bankCounter = signal<string | null>(this.current()?.company?.bankAccount?.bankCounter ?? '');
  bankNumber = signal<string | null>(this.current()?.company?.bankAccount?.bankAccountNumber ?? '');
  bankKey = signal<string | null>(this.current()?.company?.bankAccount?.bankAccountKey ?? '');

  // Email server
  emailFrom = signal<string | null>(this.current()?.emailServer?.from ?? '');
  emailType = signal<string | null>(this.current()?.emailServer?.type ?? null);
  emailHost = signal<string | null>(this.current()?.emailServer?.host ?? '');
  emailPort = signal<string | null>((this.current()?.emailServer?.port ?? null) as any);
  emailProtocol = signal<string | null>(this.current()?.emailServer?.protocol ?? '');
  emailUseTLS = signal<boolean>(this.current()?.emailServer?.useTLS ?? false);
  emailUseAuth = signal<boolean>(this.current()?.emailServer?.useAuth ?? false);
  emailUsername = signal<string | null>(this.current()?.emailServer?.username ?? '');

  // local saving guard to avoid double submitting of the form
  saving = signal(false);

  // Validation helpers
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  contactEmailError = computed<string | null>(() => {
    const v = (this.contactEmail() || '').trim();
    if (!v) return null;
    return this.emailRegex.test(v) ? null : 'Email invalide';
  });
  emailFromError = computed<string | null>(() => {
    const v = (this.emailFrom() || '').trim();
    if (!v) return null;
    return this.emailRegex.test(v) ? null : 'Email expediteur invalide';
  });
  emailUsernameError = computed<string | null>(() => {
    const v = (this.emailUsername() || '').trim();
    if (!v) return null;
    return this.emailRegex.test(v) ? null : 'Nom utilisateur (email) invalide';
  });
  websiteError = computed<string | null>(() => {
    const v = (this.website() || '').trim();
    if (!v) return null;
    try {
      const u = new URL(v);
      return (u.protocol === 'http:' || u.protocol === 'https:') ? null : 'URL invalide';
    } catch {
      return 'URL invalide';
    }
  });
  hasErrors = computed(() => !!(this.contactEmailError() || this.emailFromError() || this.emailUsernameError() || this.websiteError()));

  emailTypeOptions: SelectOption[] = [
    { value: MailServerType.GOOGLE, label: 'Google' },
    { value: MailServerType.YAHOO, label: 'Yahoo' },
    { value: MailServerType.MICROSOFT, label: 'Microsoft' },
    { value: MailServerType.OTHER, label: 'Autre' },
  ];

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.logoFile.set(file);
      this.logoFilename.set(file.name);
      const reader = new FileReader();
      reader.onload = () => this.logoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onToggleTLS(event: Event) {
    const input = event.target as HTMLInputElement;
    this.emailUseTLS.set(!!input.checked);
  }

  onToggleAuth(event: Event) {
    const input = event.target as HTMLInputElement;
    this.emailUseAuth.set(!!input.checked);
  }

  async onSubmit() {
    if (this.store.loading() || this.saving()) return;
    const id = this.current()?.id;
    if (!id) return;
    if (this.hasErrors()) return;

    // Map selected country code to full country name before saving
    const rawCountry = (this.country() || '').trim();
    let countryName: string | null = null;
    if (rawCountry) {
      const found = COUNTRIES.find(c => c.code === rawCountry || c.name.toLowerCase() === rawCountry.toLowerCase());
      countryName = found ? found.name : rawCountry;
    }

    // TODO: integrate with backend upload endpoint for the logo; for now we only send the filename
    const payload = {
      company: {
        name: this.companyName() || '',
        logoFilename: this.logoFilename() || null,
        presidentId: this.presidentId() || null,
        address: {
          street: this.street() || null,
          city: this.city() || null,
          country: countryName,
          zipCode: this.zipCode() || null,
          website: this.website() || null,
        },
        contact: {
          name: this.contactName() || null,
          email: this.contactEmail() || null,
          phone: this.contactPhone() || null,
          function: this.contactFunction() || null,
        },
        bankAccount: {
          bankAccountOwner: this.bankOwner() || '',
          bankName: this.bankName() || '',
          bankCode: this.bankCode() || '',
          bankCounter: this.bankCounter() || '',
          bankAccountNumber: this.bankNumber() || '',
          bankAccountKey: this.bankKey() || '',
        }
      },
      emailServer: {
        from: this.emailFrom() || null,
        type: (this.emailType() as any) || null,
        host: this.emailHost() || null,
        port: this.emailPort() ? Number(this.emailPort()) : null,
        protocol: this.emailProtocol() || null,
        useTLS: this.emailUseTLS(),
        useAuth: this.emailUseAuth(),
        username: this.emailUsername() || null,
      }
    };

    this.saving.set(true);

    const updated = await this.store.update(id, payload as any);
    if (updated) {
      this.toast.success(this.store.message() || 'settings.messages.update.success');
      this.router.navigate(['/settings', 'view']);
    } else {
      this.toast.error(this.store.error() || 'common.error');
    }

    this.saving.set(false);
  }

  onCancel() {
    history.back();
  }
}
