import { Controller } from '@nestjs/common';
import {
  Client,
  ClientKafka,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';

import { PurchaseMessageDTO, RefundPurchaseMessageDTO } from './purchases.dto';
import { PurchasesService } from './purchases.service';

interface KafkaMessage<T> {
  value: T;
}

@Controller()
export class PurchasesController {
  @Client({
    transport: Transport.KAFKA,
    options: { client: { brokers: ['localhost:9092'] } },
  })
  private client: ClientKafka;

  constructor(private readonly purchasesService: PurchasesService) {}

  @MessagePattern('hidra.purchase')
  async receivePurchase(@Payload() message: KafkaMessage<PurchaseMessageDTO>) {
    const purchase = await this.purchasesService.createPurchase(message.value);

    this.client.emit(purchase.product.slug, purchase);
  }

  @MessagePattern('hidra.refund')
  async refundPurchase(
    @Payload() message: KafkaMessage<RefundPurchaseMessageDTO>,
  ) {
    const purchase = await this.purchasesService.refundPurchase(
      message.value.purchaseId,
    );

    this.client.emit(purchase.product.slug, purchase);
  }
}
