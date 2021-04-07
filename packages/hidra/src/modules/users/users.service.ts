import { User } from '@prisma/client';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '@services/prisma.service';

export interface UserPagination {
  data: User[];
  page: number;
  total: number;
  perPage: number;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    perPage = 10,
    fields: string[] = [],
  ): Promise<UserPagination> {
    const [total, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        take: perPage,
        skip: (page - 1) * perPage,
        include: {
          address: fields.includes('address'),
          purchases: {
            include: {
              product: true,
            },
          },
        },
      }),
    ]);

    return {
      page,
      perPage,
      data: users,
      total,
    };
  }

  findById(id: string): Promise<User> {
    return this.prisma.user.findFirst({
      include: {
        address: true,
        purchases: true,
      },
      where: {
        id,
      },
    });
  }
}
