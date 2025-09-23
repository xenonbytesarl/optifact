import { computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import { userStore } from '../user.store';
import { RoleView, UserView } from '../../../core/api/user.api';
import { UserFormValue } from '../components/user-form';

export function useUserScreen() {
  const store = inject(userStore);
  const router = inject(Router);
  const toast = inject(ToastService);

  const formValue = signal<UserFormValue>({ firstname: '', lastname: '', email: '', phone: '', actorId: null, roleIds: [] });
  const loading = computed(() => store.loading());

  // validations
  const lastnameRequired = computed(() => !formValue().lastname || !formValue().lastname.trim());
  const emailRequired = computed(() => !formValue().email || !formValue().email.trim());
  const emailInvalid = computed(() => {
    const v = (formValue().email || '').trim();
    if (!v) return false;
    const re = /^(?!.{321})[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return !re.test(v);
  });
  const roleRequired = computed(() => !formValue().roleIds || formValue().roleIds.length === 0);

  const invalid = computed(() => lastnameRequired() || emailRequired() || emailInvalid() || roleRequired());

  function onValueChange(v: UserFormValue) {
    formValue.set(v);
  }

  async function saveNew() {
    if (invalid() || loading()) {
      return false;
    }
    const v = formValue();
    const roles = (store.roles() || []).filter(r => v.roleIds.includes(r.id));
    const payload: Partial<UserView> = {
      firstname: v.firstname,
      lastname: v.lastname,
      email: v.email,
      phone: v.phone,
      actorId: v.actorId,
      roles
    };
    const response = await store.create(payload);
    if (response) {
      toast.success(store.message() as string);
      router.navigate(['/users', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  async function saveEdit(id: string) {
    if (invalid() || loading()) {
      return false;
    }
    const v = formValue();
    const roles = (store.roles() || []).filter(r => v.roleIds.includes(r.id));
    const payload: Partial<UserView> = {
      firstname: v.firstname,
      lastname: v.lastname,
      email: v.email,
      phone: v.phone,
      actorId: v.actorId,
      roles
    };
    const response = await store.update( id, payload);
    if (response) {
      toast.info(store.message() as string);
      router.navigate(['/users', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  function setFromCurrent() {
    const u = store.current();
    if (!u) return;
    const roleIds = (u.roles || []).map(r => r.id);
    formValue.set({ firstname: u.firstname || '', lastname: u.lastname, email: u.email, phone: u.phone || '', actorId: u.actorId || null, roleIds });
  }

  function goBack() {
    router.navigate(['']);
  }

  return {
    store,
    formValue,
    loading,
    invalid,
    lastnameRequired,
    emailRequired,
    emailInvalid,
    roleRequired,
    onValueChange,
    saveNew,
    saveEdit,
    setFromCurrent,
    goBack,
  };
}
