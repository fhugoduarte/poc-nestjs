import { Purchase } from '.prisma/client';
import { CreatePurchaseDTO } from '../dtos/create-purchase.dto';
import {
  CreatePurchaseResponse,
  PurchasePagination,
  PurchasesServiceContract,
  RefundPurchaseResponse,
} from '../interfaces/purchases.interface';

export class FakePurchasesService implements PurchasesServiceContract {
  private purchases: Purchase[] = [];

  createPurchase(data: CreatePurchaseDTO): Promise<CreatePurchaseResponse> {
    throw new Error('Method not implemented.');
  }
  refundPurchase(id: string): Promise<RefundPurchaseResponse> {
    throw new Error('Method not implemented.');
  }
  findAll(page: number, perPage: number): Promise<PurchasePagination> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Purchase> {
    throw new Error('Method not implemented.');
  }
}
