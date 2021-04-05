import { Address, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/common/prisma.service';
import * as faker from 'faker';

interface MakeUserDTO extends Omit<User, 'addressId'> {
  address: Address;
}

@Injectable()
export class UsersFactory {
  constructor(private prisma: PrismaService) {}

  makeUser(data = {} as MakeUserDTO): Promise<User> {
    const customer = {
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const fakeAddress = {
      street: faker.address.streetName(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
    };

    const { address: addressData, ...userData } = data;

    return this.prisma.user.create({
      data: {
        ...customer,
        ...userData,
        address: {
          create: {
            ...fakeAddress,
            ...addressData,
          },
        },
      },
    });
  }
}
