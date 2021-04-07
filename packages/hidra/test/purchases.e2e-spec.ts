import { Product, User } from '@prisma/client';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CommonModule } from '@modules/common/common.module';
import { PurchasesModule } from '@modules/purchases/purchases.module';

import { ProductsFactory } from './factories/product.factory';
import { PurchasesFactory } from './factories/purchases.factory';
import { UsersFactory } from './factories/users.factory';

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

  it('should get a purchase by id', async () => {
    const purchase = await purchasesFactory.makePurchase({
      userId: user.id,
      productId: product.id,
    });

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query purchaseData($purchaseId: String!) {
            purchase(id: $purchaseId) {
              id
            }
          }
        `,
        variables: {
          purchaseId: purchase.id,
        },
      })
      .set('authorization', 'dale');

    expect(response.body.data).toMatchObject({
      purchase: {
        id: purchase.id,
      },
    });
  });

  it('should get an exception', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
        query purchaseData($purchaseId: String!) {
          purchase(id: $purchaseId) {
            id
          }
        }
      `,
      })
      .set('authorization', 'dale');

    expect(response.body).toMatchObject({
      errors: [
        {
          message:
            'Variable "$purchaseId" of required type "String!" was not provided.',
        },
      ],
    });
  });

  it('should not get a purchase by id when that doest not exist', async () => {
    await purchasesFactory.makePurchase({
      userId: user.id,
      productId: product.id,
    });

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query purchaseData($purchaseId: String!) {
            purchase(id: $purchaseId) {
              id
            }
          }
        `,
        variables: {
          purchaseId: user.id,
        },
      })
      .set('authorization', 'dale');

    expect(response.body.data).toMatchObject({
      purchase: null,
    });
  });

  it('should refund a purchase', async () => {
    const purchase = await purchasesFactory.makePurchase({
      userId: user.id,
      productId: product.id,
    });

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation RefundPurchase($purchaseId: String!) {
            refundPurchase(id: $purchaseId) {
              status
            }
          }
        `,
        variables: {
          purchaseId: purchase.id,
        },
      })
      .set('authorization', 'dale');

    expect(response.body.data).toMatchObject({
      refundPurchase: {
        status: 'canceled',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
