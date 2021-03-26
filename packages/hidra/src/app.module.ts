import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
