import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import { PurchasesService } from '../src/purchases/purchases.service';
import { CommonModule } from '../src/common/common.module';
import { PurchasesModule } from '../src/purchases/purchases.module';
// import { AppModule } from '../src/app.module';

describe('Purchases', () => {
  let app: INestApplication;
  /*   const purchasesService = {
    findAll: () => ({
      data: [],
      page: 1,
      perPage: 10,
      total: 0,
    }),
  };
 */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        /*  ConfigModule.forRoot({
          envFilePath: '.env.testing',
          isGlobal: true,
        }), */
        CommonModule,
        PurchasesModule,
      ],
    })
      /* .overrideProvider(PurchasesService)
      .useValue(purchasesService) */
      .compile();

    app = moduleRef.createNestApplication();
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
    // .expect(200)
    // .expect({
    //   data: {
    //     purchases: [],
    //   },
    // });
  });

  afterAll(async () => {
    await app.close();
  });
});
