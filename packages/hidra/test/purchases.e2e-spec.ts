import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { PurchasesService } from '../src/purchases/purchases.service';
import { AppModule } from '../src/app.module';

describe('Purchases', () => {
  let app: INestApplication;
  const purchasesService = {
    findAll: () => ({
      data: [],
      page: 1,
      perPage: 10,
      total: 0,
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PurchasesService)
      .useValue(purchasesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET purchases', () => {
    return request(app.getHttpServer())
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
      .set('authorization', 'dale')
      .expect(200)
      .expect({
        data: {
          purchases: purchasesService.findAll(),
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
