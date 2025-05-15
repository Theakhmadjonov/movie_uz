import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { GetMoviesDto } from './dto/get-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

    async getMovies(query: GetMoviesDto) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        
    }

  async getMovieBySlug(slug: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        movieCategories: { include: { category: true } },
        movieFiles: true,
        reviews: true,
      },
    });
    if (!movie) {
      throw new Error('Film topilmadi');
    }
    const files = movie.movieFiles.map((file) => ({
      quality: file.quality,
      language: file.language,
      size_mb: Math.round(Buffer.byteLength(file.fileUrl || '', 'utf-8') / 1024 / 1024),
    }));
    const avgRating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, r) => acc + r.rating, 0) / movie.reviews.length
        : 0;
    return {
      success: true,
      data: {
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        description: movie.description,
        release_year: movie.releaseYear,
        duration_minutes: movie.durationMinutes,
        poster_url: movie.posterUrl,
        rating: movie.rating,
        subscription_type: movie.subscriptionType,
        view_count: movie.viewCount,
        is_favorite: true,
        categories: movie.movieCategories.map((mc) => mc.category.name),
        files,
        reviews: {
          average_rating: Number(avgRating.toFixed(1)),
          count: movie.reviews.length,
        },
      },
    };
  }
}
