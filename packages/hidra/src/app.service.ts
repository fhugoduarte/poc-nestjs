import { Injectable } from '@nestjs/common';
import { User, Address } from '@prisma/client';
import { CreateUserInput } from './graphql.schema';

import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser({ address, ...user }: CreateUserInput): Promise<User> {
    const data = await this.prisma.user.create({
      data: {
        ...user,
        address: {
          create: address,
        },
      },
    });

    return data;
  }

  async findAddress(id: string): Promise<Address> {
    return this.prisma.address.findFirst({
      where: {
        id,
      },
    });
  }
}
