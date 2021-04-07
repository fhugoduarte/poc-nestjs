import { Module } from '@nestjs/common';

import { PurchasesController } from './purchases.controller';
import { PurchasesResolver } from './purchases.resolver';
import { PurchasesService } from './purchases.service';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, PurchasesResolver],
})
export class PurchasesModule {}
