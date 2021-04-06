import { Purchase } from '.prisma/client';
import * as faker from 'faker';

import { CreatePurchaseDTO } from '../dtos/create-purchase.dto';
import {
  CreatePurchaseResponse,
  PurchasePagination,
  PurchasesServiceContract,
  RefundPurchaseResponse,
} from '../interfaces/purchases.interface';

export class FakePurchasesService implements PurchasesServiceContract {
  private purchases: Purchase[] = [];

  async createPurchase(
    data: CreatePurchaseDTO,
  ): Promise<CreatePurchaseResponse> {
    const { product, customer, ...purchaseData } = data;
    const now = new Date();

    const purchase: Purchase = {
      id: faker.datatype.uuid(),
      createdAt: now,
      updatedAt: now,
      status: 'processed',
      ...purchaseData,
      productId: product.id,
      userId: customer.id,
    };

    this.purchases.push(purchase);

    return purchase as CreatePurchaseResponse;
  }

  async refundPurchase(id: string): Promise<RefundPurchaseResponse> {
    let purchaseIndex = null;
    const purchase = this.purchases.find((item, index) => {
      const match = item.id === id;
      if (match) {
        purchaseIndex = index;
        return true;
      }

      return false;
    });

    purchase.status = 'canceled';
    this.purchases.splice(purchaseIndex, 1);

    return purchase as RefundPurchaseResponse;
  }

  async findAll(page = 1, perPage = 10): Promise<PurchasePagination> {
    const offset = (page - 1) * perPage;

    const purchases = this.purchases.slice(offset, offset + perPage);

    return {
      page,
      perPage,
      total: this.purchases.length,
      data: purchases,
    };
  }

  async findById(id: string): Promise<Purchase> {
    const purchase = this.purchases.find((item) => item.id === id);
    return purchase;
  }
}
