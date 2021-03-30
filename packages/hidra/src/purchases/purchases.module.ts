import { Module } from '@nestjs/common';

import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { PurchasesResolver } from './purchases.resolver';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, PurchasesResolver],
})
export class PurchasesModule {}
