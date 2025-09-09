import {AddressType, ContactType} from '../../../core/api/actor/models';

export interface AddressFormValue {
  id: string | null;
  type: AddressType;
  street: string | null;
  city: string;
  country: string | null;
  zipCode: string | null;
  state: string | null;
  actorId: string | null;
}

export interface ContactFormValue {
  id: string | null;
  type: ContactType;
  name: string;
  phone: string | null;
  email: string | null;
  function: string | null;
  actorId: string | null;
}

export interface ActorFormValue {
  name: string;
  reference: string;
  addresses: AddressFormValue[];
  contacts: ContactFormValue[];
}
