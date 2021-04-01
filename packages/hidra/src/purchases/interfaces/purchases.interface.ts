import { Product, Purchase } from '@prisma/client';
import { CreatePurchaseDTO } from '../dtos/create-purchase.dto';

export interface CreatePurchaseResponse extends Purchase {
  product: Product;
}

export interface RefundPurchaseResponse extends Purchase {
  product: Product;
}

export interface PurchasePagination {
  data: Purchase[];
  page: number;
  total: number;
  perPage: number;
}

export interface PurchasesServiceContract {
  createPurchase(data: CreatePurchaseDTO): Promise<CreatePurchaseResponse>;
  refundPurchase(id: string): Promise<RefundPurchaseResponse>;
  findAll(page: number, perPage: number): Promise<PurchasePagination>;
  findById(id: string): Promise<Purchase>;
}
