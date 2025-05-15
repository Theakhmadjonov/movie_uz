import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async addReview(userId: string, movieId: string, createReviewDto: CreateReviewDto) {
    const { rating, comment } = createReviewDto;
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }
    const review = await this.prisma.review.create({
      data: {
        userId,
        movieId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return {
      success: true,
      message: "Review successfully added",
      data: {
        id: review.id,
        user: review.user,
        movie_id: review.movieId,
        rating: review.rating,
        comment: review.comment,
        created_at: review.createdAt,
      },
    };
  }

  async deleteReview(userId: string, movieId: string, reviewId: string) {
    const review = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        movieId,
        userId,
      },
    });

    if (!review) {
      throw new NotFoundException("Review not found");
    }
    await this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
    return {
      success: true,
      message: "Review successfully deleted",
    };
  }
}
