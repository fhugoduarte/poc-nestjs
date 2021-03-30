import { Injectable } from '@nestjs/common';
import { User, Address } from '@prisma/client';
import { CreateUserInput } from '../graphql.schema';

import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findById(id: string): Promise<User> {
    return this.prisma.user.findFirst({
      include: {
        address: true,
      },
      where: {
        id,
      },
    });
  }

  createUser({ address, ...user }: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...user,
        address: {
          create: address,
        },
      },
    });
  }

  findAddress(id: string): Promise<Address> {
    return this.prisma.address.findFirst({
      where: {
        id,
      },
    });
  }

  findPurchases(userId: string, page: number) {
    return this.prisma.purchase.findMany();
  }
}
