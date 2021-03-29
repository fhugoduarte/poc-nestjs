import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

import { PurchaseMessageDTO } from './purchases.dto';
import { PurchasesService } from './purchases.service';

interface KafkaMessage<T> {
  value: T;
}

@Controller()
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService,
    @Inject('PURCHASES_SERVICE') private client: ClientKafka,
  ) {}

  @MessagePattern('hidra.purchase')
  async receivePurchase(@Payload() message: KafkaMessage<PurchaseMessageDTO>) {
    const purchase = await this.purchasesService.createPurchase(message.value);

    this.client.emit(purchase.product.slug, purchase);
  }
}
