import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, UsersModule, PurchasesModule],
})
export class AppModule {}
