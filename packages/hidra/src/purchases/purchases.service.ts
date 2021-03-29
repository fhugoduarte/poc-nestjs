import { Injectable } from '@nestjs/common';
import { Product, Purchase } from '@prisma/client';

import { PrismaService } from '../common/prisma.service';
import { PurchaseMessageDTO } from './purchases.dto';

export interface CreatePurchaseResponse extends Purchase {
  product: Product;
}

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async createPurchase({
    customer,
    product,
    id,
  }: PurchaseMessageDTO): Promise<CreatePurchaseResponse> {
    const { id: slug, ...productData } = product;
    const { address, ...customerData } = customer;

    const data = await this.prisma.purchase.create({
      data: {
        id,
        status: 'processed',
        customer: {
          connectOrCreate: {
            create: {
              ...customerData,
              address: {
                create: address,
              },
            },
            where: {
              id: customer.id,
            },
          },
        },
        product: {
          connectOrCreate: {
            create: { ...productData, slug },
            where: {
              slug,
            },
          },
        },
      },
      include: {
        product: true,
      },
    });

    return data;
  }
}
