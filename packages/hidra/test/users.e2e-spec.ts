import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CommonModule } from '@modules/common/common.module';
import { UsersModule } from '@modules/users/users.module';

import { UsersFactory } from './factories/users.factory';

describe('Users', () => {
  let app: INestApplication;

  let usersFactory: UsersFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommonModule, UsersModule, UsersFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    usersFactory = moduleRef.get(UsersFactory);

    await app.init();
  });

  it('should throw a new exception when trying to get a purchase without authorizaton header', async () => {
    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: `
          {
            users {
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
        users: null,
      },
    });
  });

  it('should get the users', async () => {
    const user = await usersFactory.makeUser();

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          {
            users {
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
      users: {
        data: [
          {
            id: user.id,
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
