import { Purchase } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/common/prisma.service';

interface MakePurchaseDTO {
  id?: string;
  status?: string;
  userId: string;
  productId: string;
}

@Injectable()
export class PurchasesFactory {
  constructor(private prisma: PrismaService) {}

  makePurchase(data: MakePurchaseDTO): Promise<Purchase> {
    return this.prisma.purchase.create({
      data: {
        status: 'processed',
        ...data,
      },
      include: {
        product: true,
      },
    });
  }
}
