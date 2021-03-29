import { Module } from '@nestjs/common';

import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
