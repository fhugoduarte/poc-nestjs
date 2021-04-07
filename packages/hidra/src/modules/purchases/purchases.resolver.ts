import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientKafka } from '@nestjs/microservices';

import { AuthGuard } from '@guards/auth.guard';

import { PurchasesService } from './purchases.service';

@Resolver('Purchase')
@UseGuards(AuthGuard)
export class PurchasesResolver {
  constructor(
    private readonly purchasesService: PurchasesService,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  @Query('purchases')
  getPurchases(@Args('page') page: number) {
    return this.purchasesService.findAll(page);
  }

  @Query('purchase')
  getPurchase(@Args('id') id: string) {
    return this.purchasesService.findById(id);
  }

  @Mutation('refundPurchase')
  async refundPurchase(@Args('id') id: string) {
    const purchase = await this.purchasesService.refundPurchase(id);

    this.kafkaClient.emit(purchase.product.slug, purchase);

    return purchase;
  }
}
