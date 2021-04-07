import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { PrismaService } from '@services/prisma.service';

import { KafkaModule } from './kafka.module';

const environmentFiles = {
  test: '.env.testing',
  development: '.env.development',
  production: '.env',
};

const envFilePath = environmentFiles[process.env.NODE_ENV];

console.log('NODE_ENV', process.env.NODE_ENV);

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
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
