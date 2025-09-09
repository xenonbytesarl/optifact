export type AddressType = 'DEFAULT' | 'PROJECT' | 'ACCOUNTING' | 'COMMERCIAL' | 'OTHERS' | 'TECHNICAL';
export type ContactType = 'DEFAULT' | 'INVOICE' | 'SHIPPING' | 'OTHER';

export interface Address {
  id?: string;
  type: AddressType;
  street?: string;
  city: string;
  country: string;
  zipCode?: string;
  state?: string;
  actorId?: string;
}

export interface Contact {
  id?: string;
  type: ContactType;
  name: string;
  phone?: string;
  email?: string;
  function?: string;
  actorId?: string;
}

export interface Actor {
  id: string;
  name: string;
  reference?: string;
  addresses: Address[];
  contacts: Contact[];
}

export type ActorSortColumn = 'name' | 'reference';
