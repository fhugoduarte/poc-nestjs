import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('hidra.purchase')
  purchase(@Payload() message: any) {
    console.log('hidra.purchase', message);
  }
}
