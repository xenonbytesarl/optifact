import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { InputPhoneComponent } from '../../../shared/ui/input-phone';
import { AutocompleteComponent, AutocompleteItem } from '../../../shared/ui/autocomplete';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { RoleView } from '../../../core/api/user.api';
import { CardComponent } from '../../../shared/ui/card';

export interface UserFormValue {
  firstname?: string | null;
  lastname: string;
  email: string;
  phone?: string | null;
  actorId?: string | null;
  roleIds: string[];
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, InputTextComponent, InputPhoneComponent, AutocompleteComponent, TranslatePipe, CardComponent],
  template: `
    <form class="flex flex-col gap-6">
      <app-card [title]="('users.sections.identity' | t)">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <app-form-field [label]="('users.fields.firstname' | t)">
            <app-input [disabled]="disabled()" [value]="value().firstname || ''" (valueChange)="onFirstname($event)" />
          </app-form-field>
          <app-form-field [label]="('users.fields.lastname' | t)" [required]="true" [error]="(lastnameTouched() && lastnameRequired()) ? ('validation.required' | t) : null">
            <app-input [disabled]="disabled()" [error]="lastnameTouched() && lastnameRequired()" [value]="value().lastname || ''" (valueChange)="onLastname($event)" (blurred)="markLastnameTouched()" />
          </app-form-field>
          <app-form-field [label]="('users.fields.email' | t)" [required]="true" [error]="emailErrorText()">
            <app-input [disabled]="disabled()" [error]="emailTouched() && (emailRequired() || emailInvalid())" [type]="'email'" [value]="value().email || ''" (valueChange)="onEmail($event)" (blurred)="markEmailTouched()" />
          </app-form-field>
          <app-form-field [label]="('users.fields.phone' | t)">
            <app-input-phone [disabled]="disabled()" [value]="value().phone || ''" (valueChange)="onPhone($event)" />
          </app-form-field>
        </div>
      </app-card>

      <app-card [title]="('users.sections.relations' | t)">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <app-form-field [label]="('users.fields.actor' | t)">
            <app-autocomplete [disabled]="disabled()" [placeholder]="('users.fields.actorPlaceholder' | t)" [items]="actorItems()" [value]="value().actorId ?? null" (valueChange)="onActorId($event)" />
          </app-form-field>
          <app-form-field [label]="('users.fields.role' | t)" [required]="true" [error]="(roleTouched() && rolesRequired()) ? ('validation.required' | t) : null">
            <app-autocomplete
              [disabled]="disabled()"
              [placeholder]="('users.fields.rolePlaceholder' | t)"
              [items]="roleItemsAc()"
              [value]="singleRoleId()"
              (valueChange)="onRoleId($event)"
              (blurred)="markRoleTouched()" />
          </app-form-field>
        </div>
      </app-card>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  value = model<UserFormValue>({ firstname: '', lastname: '', email: '', phone: '', actorId: null, roleIds: [] });
  disabled = input<boolean>(false);
  roles = input<RoleView[]>([]);
  actors = input<AutocompleteItem[]>([]); // for Autocomplete

  changed = output<UserFormValue>();

  actorItems = computed(() => this.actors());
  roleItemsAc = computed<AutocompleteItem[]>(() => (this.roles() || []).map(r => ({ value: r.id, label: r.name })));
  singleRoleId = computed<string | null>(() => (this.value().roleIds && this.value().roleIds.length ? this.value().roleIds[0] : null));

  // touched flags for lazy validation
  lastnameTouched = signal(false);
  emailTouched = signal(false);
  roleTouched = signal(false);

  markLastnameTouched() { this.lastnameTouched.set(true); }
  markEmailTouched() { this.emailTouched.set(true); }
  markRoleTouched() { this.roleTouched.set(true); }

  // email validation
  emailInvalid = computed(() => {
    const v = (this.value().email || '').trim();
    if (!v) return false;
    const re = /^(?!.{321})[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return !re.test(v);
  });
  emailErrorText = computed(() => {
    if (!this.emailTouched()) return null;
    if (this.emailRequired()) return 'validation.required' as any;
    if (this.emailInvalid()) return 'email.invalid' as any;
    return null;
  });

  onRoleId(v: string | null) {
    this.value.update(s => ({ ...s, roleIds: v ? [v] : [] }));
    this.roleTouched.set(true);
    this.changed.emit(this.value());
  }

  lastnameRequired = computed(() => !this.value().lastname || !this.value().lastname.trim());
  emailRequired = computed(() => !this.value().email || !this.value().email.trim());
  rolesRequired = computed(() => !this.value().roleIds || this.value().roleIds.length === 0);

  onFirstname(v: string | null) { this.value.update(s => ({ ...s, firstname: v })); this.changed.emit(this.value()); }
  onLastname(v: string | null) { this.value.update(s => ({ ...s, lastname: v as string })); this.changed.emit(this.value()); }
  onEmail(v: string | null) { this.value.update(s => ({ ...s, email: v as string})); this.changed.emit(this.value()); }
  onPhone(v: string | null) { this.value.update(s => ({ ...s, phone: v })); this.changed.emit(this.value()); }
  onActorId(v: string | null) { this.value.update(s => ({ ...s, actorId: v ?? null })); this.changed.emit(this.value()); }
}
