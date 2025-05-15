import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
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

  async addfavorite(userId: string, createFavoriteDto: CreateFavoriteDto) {}

  async deleteFavorite(userId: string, movieId: string) {}
}
