import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

import { CreatePurchaseDTO } from './dtos/create-purchase.dto';
import { RefundPurchaseDTO } from './dtos/refund-purchase.dto';
import { PurchasesService } from './purchases.service';

interface KafkaMessage<T> {
  value: T;
}

@Controller()
export class PurchasesController implements OnModuleInit {
  constructor(
    private readonly purchasesService: PurchasesService,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  @MessagePattern('hidra.purchase')
  async receivePurchase(@Payload() message: KafkaMessage<CreatePurchaseDTO>) {
    const purchase = await this.purchasesService.createPurchase(message.value);

    this.kafkaClient.emit(purchase.product.slug, purchase);
  }

  @MessagePattern('hidra.refund')
  async refundPurchase(@Payload() message: KafkaMessage<RefundPurchaseDTO>) {
    const purchase = await this.purchasesService.refundPurchase(
      message.value.purchaseId,
    );

    this.kafkaClient.emit(purchase.product.slug, purchase);
  }
}
