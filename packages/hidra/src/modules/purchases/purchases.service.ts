import { Product, Purchase } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '@services/prisma.service';

import { CreatePurchaseDTO } from './dtos/create-purchase.dto';
import { PurchasesServiceContract } from './interfaces/purchases.interface';

interface CreatePurchaseResponse extends Purchase {
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

@Injectable()
export class PurchasesService implements PurchasesServiceContract {
  constructor(private prisma: PrismaService) {}

  createPurchase({
    customer,
    product,
    id,
  }: CreatePurchaseDTO): Promise<CreatePurchaseResponse> {
    const { id: slug, ...productData } = product;
    const { address, ...customerData } = customer;

    return this.prisma.purchase.create({
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
  }

  refundPurchase(id: string): Promise<RefundPurchaseResponse> {
    return this.prisma.purchase.update({
      data: {
        status: 'canceled',
      },
      include: {
        product: true,
      },
      where: {
        id,
      },
    });
  }

  async findAll(page = 1, perPage = 10): Promise<PurchasePagination> {
    const options = {
      take: perPage,
      skip: (page - 1) * perPage,
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        product: true,
      },
    };

    const [purchases, total] = await Promise.all([
      this.prisma.purchase.findMany(options),
      this.prisma.purchase.count(),
    ]);

    return {
      page,
      perPage,
      data: purchases,
      total,
    };
  }

  findById(id: string): Promise<Purchase> {
    return this.prisma.purchase.findFirst({
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        product: true,
      },
      where: {
        id,
      },
    });
  }
}
