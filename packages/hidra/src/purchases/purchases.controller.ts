import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { PurchaseMessageDTO } from './purchases.dto';
import { PurchasesService } from './purchases.service';

interface KafkaMessage<T> {
  value: T;
}

@Controller()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @MessagePattern('hidra.purchase')
  receivePurchase(@Payload() message: KafkaMessage<PurchaseMessageDTO>) {
    this.purchasesService.createPurchase(message.value);
  }
}
