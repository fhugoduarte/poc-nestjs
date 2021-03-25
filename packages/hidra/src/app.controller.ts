import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';

import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @MessagePattern('hidra.purchase')
  purchase(@Payload() message: any) {
    console.log('hidra.purchase', message);
  }

  @Get()
  async createUser(): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: 'email@email.com',
        name: 'Jhon Doe',
        address: {
          create: {
            city: 'White Stone',
            state: 'CE',
            street: 'Avenida',
          },
        },
      },
    });

    return user;
  }
}
