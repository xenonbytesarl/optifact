export type AddressType = 'facturation' | 'livraison' | 'défaut' | 'autres';
export type ContactType = 'commercial' | 'technique' | 'comptabilité' | 'autres';

export interface Address {
  id: string;
  type: AddressType;
  street: string;
  city: string;
  country: string;
}

export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  phone: string;
  email: string;
  role?: string;
}

export interface Customer {
  id: string;
  name: string;
  reference?: string;
  category?: string;
  addresses: Address[];
  contacts: Contact[];
}
