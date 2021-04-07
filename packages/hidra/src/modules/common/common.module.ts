import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { PrismaService } from '@services/prisma.service';

import { KafkaModule } from './kafka.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
    }),
    KafkaModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService, KafkaModule],
})
export class CommonModule {}
