import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movie.service';
import { GetMoviesDto } from './dto/get-movie.dto';
import AuthGuard from 'src/common/guards/auth.guard';

@Controller('api/movies')
@UseGuards(AuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query() query: GetMoviesDto) {
    try {
      const result = await this.moviesService.getMovies(query);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':slug')
  async getMovieBySlug(@Param('slug') slug: string) {
    try {
      const movie = await this.moviesService.getMovieBySlug(slug);
      return {
        success: true,
        data: movie,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
