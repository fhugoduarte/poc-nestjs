import { Product } from '@prisma/client';
import * as faker from 'faker';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '@services/prisma.service';

type MakeProductDTO = Omit<Product, 'id'>;

const productOptions = [
  {
    slug: 'ignite',
    type: 'onetime',
    amount: 1000,
  },
  {
    slug: 'experts',
    type: 'recurring',
    amount: 37,
  },
];

@Injectable()
export class ProductsFactory {
  constructor(private prisma: PrismaService) {}

  makeProduct(data = {} as MakeProductDTO): Promise<Product> {
    const product = faker.random.arrayElement(productOptions);

    return this.prisma.product.create({
      data: {
        ...product,
        ...data,
      },
    });
  }
}
