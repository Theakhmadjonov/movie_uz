import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';


@Module({
  imports: [AuthModule, SubscriptionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
