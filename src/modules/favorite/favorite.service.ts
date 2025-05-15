import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFavorite(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            slug: true,
            posterUrl: true,
            releaseYear: true,
            rating: true,
            subscriptionType: true,
          },
        },
      },
    });

    const movies = favorites.map((fav) => ({
      id: fav.movie.id,
      title: fav.movie.title,
      slug: fav.movie.slug,
      poster_url: fav.movie.posterUrl,
      release_year: fav.movie.releaseYear,
      rating: fav.movie.rating,
      subscription_type: fav.movie.subscriptionType,
    }));

    return {
      success: true,
      data: {
        movies,
        total: movies.length,
      },
    };
  }

  async addfavorite(userId: string, movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      select: { title: true },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        movieId,
      },
    });
    return {
      success: true,
      message: 'Movie added to favorites',
      data: {
        id: favorite.id,
        movie_id: favorite.movieId,
        movie_title: movie.title,
        created_at: favorite.createdAt,
      },
    };
  }

  async deleteFavorite(userId: string, movieId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        movieId,
      },
    });
    if (!favorite) {
      throw new NotFoundException('Movie not found');
    }
    await this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });
    return {
      success: true,
      message: 'Movie deleted in favorites',
    };
  }
}
