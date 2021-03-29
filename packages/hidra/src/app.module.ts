import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { PurchasesModule } from './purchases/purchases.module';
import { KafkaModule } from './common/kafka.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, UsersModule, PurchasesModule, KafkaModule],
})
export class AppModule {}
