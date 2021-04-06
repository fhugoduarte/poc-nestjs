import { ClientsModule, Transport } from '@nestjs/microservices';

export const KafkaClient = ClientsModule.register([
  {
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
      },
    },
  },
]);
