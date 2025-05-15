import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UseGuards } from '@nestjs/common';
import AuthGuard from 'src/common/guards/auth.guard';
import { Request } from 'express';

@Controller('api/movies')
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':movie_id/reviews')
  async addReview(
    @Param('movie_id') movieId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    try {
      const userId = req['userId'];
      return await this.reviewsService.addReview(
        userId,
        movieId,
        createReviewDto,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':movie_id/reviews/:review_id')
  async deleteReview(
    @Param('movie_id') movieId: string,
    @Param('review_id') reviewId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = req['userId'];
      return await this.reviewsService.deleteReview(userId, movieId, reviewId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
