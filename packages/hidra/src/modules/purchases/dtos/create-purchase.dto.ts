interface Address {
  street: string;
  city: string;
  state: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  address: Address;
}

interface Product {
  id: 'ignite' | 'experts';
  amount: number;
  type: 'onetime' | 'recurring';
}

export interface CreatePurchaseDTO {
  id: string;
  customer: Customer;
  product: Product;
  createdAt: Date;
}
