import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MovieModule } from './movie/movie.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ReviewModule } from './review/review.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, ProfileModule, SubscriptionModule, MovieModule, FavoriteModule, ReviewModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
