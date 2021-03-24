import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('hidra.purchase')
  purchase(@Payload() message: any) {
    console.log('hidra.purchase', message);
  }

  @Get()
  getHello(): string {
    return 'Hi my amigue';
  }
}
