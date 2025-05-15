import { Module } from '@nestjs/common';
import { MoviesController } from './movie.controller';
import { MoviesService } from './movie.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MovieModule {}
