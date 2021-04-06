import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
      },
    },
  });

  await app.startAllMicroservicesAsync();
  console.log('On fire, babado!');

  await app.listen(process.env.APP_PORT, () => {
    console.log('Namoradinha!');
  });
}

bootstrap();
