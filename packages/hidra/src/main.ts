import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const appKafka = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
      },
    },
  );

  appKafka.listen(() => {
    console.log('On fire, babado!');
  });

  const app = await NestFactory.create(AppModule);

  await app.listen(3333, () => {
    console.log('Ah ta babado!');
  });
}

bootstrap();
