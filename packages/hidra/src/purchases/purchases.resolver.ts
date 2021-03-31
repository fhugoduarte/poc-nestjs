import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { AuthGuard } from 'src/common/auth.guard';

import { PurchasesService } from './purchases.service';

@Resolver('Purchase')
@UseGuards(AuthGuard)
export class PurchasesResolver {
  @Client({
    transport: Transport.KAFKA,
    options: { client: { brokers: ['localhost:9092'] } },
  })
  private client: ClientKafka;

  constructor(private readonly purchasesService: PurchasesService) {}

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

    this.client.emit(purchase.product.slug, purchase);

    return purchase;
  }
}
