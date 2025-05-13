import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CoreModule } from './core/core.module';


@Module({
  imports: [AuthModule, SubscriptionsModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
