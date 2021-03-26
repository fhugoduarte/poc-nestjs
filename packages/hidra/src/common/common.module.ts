import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
