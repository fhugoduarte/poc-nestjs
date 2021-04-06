import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaClient } from './kafka.client';

const environmentFiles = {
  test: '.testing.env',
  development: '.development.env',
  production: '.env',
};

const envFilePath = environmentFiles[process.env.NODE_ENV];

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
    KafkaClient,
  ],
  providers: [PrismaService],
  exports: [PrismaService, KafkaClient],
})
export class CommonModule {}
