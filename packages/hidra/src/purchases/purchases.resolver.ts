import { Args, Query, Resolver } from '@nestjs/graphql';

import { PurchasesService } from './purchases.service';

@Resolver('Purchase')
export class PurchasesResolver {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Query('purchases')
  getPurchases(@Args('page') page: number) {
    return this.purchasesService.findAll(page);
  }

  @Query('purchase')
  getPurchase(@Args('id') id: string) {
    return this.purchasesService.findById(id);
  }
}
