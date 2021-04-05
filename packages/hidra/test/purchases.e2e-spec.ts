import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CommonModule } from '../src/common/common.module';
import { PurchasesModule } from '../src/purchases/purchases.module';

import { UsersFactory } from './factories/users.factory';
import { PurchasesFactory } from './factories/purchases.factory';
import { ProductsFactory } from './factories/product.factory';
import { Product, User } from '.prisma/client';

describe('Purchases', () => {
  let app: INestApplication;

  let usersFactory: UsersFactory;
  let purchasesFactory: PurchasesFactory;
  let productsFactory: ProductsFactory;

  let user: User;
  let product: Product;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CommonModule,
        PurchasesModule,
        PurchasesFactory,
        UsersFactory,
        ProductsFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    usersFactory = moduleRef.get(UsersFactory);
    purchasesFactory = moduleRef.get(PurchasesFactory);
    productsFactory = moduleRef.get(ProductsFactory);

    [user, product] = await Promise.all([
      usersFactory.makeUser(),
      productsFactory.makeProduct(),
    ]);

    await app.init();
  });

  it('should throw a new exception when trying to get a purchase without authorizaton header', async () => {
    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: `
          {
            purchases {
              data {
                id
              }
              page
              perPage
              total
            }
          }
        `,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      errors: [
        {
          message: 'Mamado!',
        },
      ],
      data: {
        purchases: null,
      },
    });
  });

  it('should get the purchases', async () => {
    const purchase = await purchasesFactory.makePurchase({
      userId: user.id,
      productId: product.id,
    });

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          {
            purchases {
              data {
                id
              }
              page
              perPage
              total
            }
          }
        `,
      })
      .set('authorization', 'dale');

    expect(response.body.data).toMatchObject({
      purchases: {
        data: [
          {
            id: purchase.id,
          },
        ],
        page: 1,
        perPage: 10,
        total: 1,
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
