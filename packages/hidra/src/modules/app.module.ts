import { Module } from '@nestjs/common';

import { CommonModule } from '@modules/common/common.module';
import { PurchasesModule } from '@modules/purchases/purchases.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [CommonModule, UsersModule, PurchasesModule],
})
export class AppModule {}
