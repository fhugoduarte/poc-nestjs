import { Query, Resolver } from '@nestjs/graphql';

import { PurchasesService } from './purchases.service';

@Resolver('Purchase')
export class PurchasesResolver {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Query('purchases')
  getPurchases() {
    return this.purchasesService.findAll();
  }
}
