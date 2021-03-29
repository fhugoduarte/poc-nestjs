import { Injectable } from '@nestjs/common';
import { Purchase } from '@prisma/client';

import { PrismaService } from '../common/prisma.service';
import { PurchaseMessageDTO } from './purchases.dto';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async createPurchase({
    customer,
    product,
    id,
  }: PurchaseMessageDTO): Promise<Purchase> {
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
    });

    return data;
  }
}
