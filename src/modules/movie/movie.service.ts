import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { GetMoviesDto } from './dto/get-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getMovies(query: GetMoviesDto) {
    let { page, limit, category, search, subscription_type } = query;
    page = Number(page) || 1;
    limit = Number(limit) || 5;
    const offset = (page - 1) * limit;
    if (!search || !category || !subscription_type) {
      return {
        success: false,
        message: 'Search, category, subscription_type are required.',
      };
    }
    const movieWhereFilter = {
      title: {
        contains: search,
      },
      subscriptionType: subscription_type,
      movieCategories: {
        some: {
          category: {
            name: {
              equals: category,
            },
          },
        },
      },
    };
    const total = await this.prisma.movie.count({
      where: movieWhereFilter,
    });
    const pages = Math.ceil(total / limit);
    const movies = await this.prisma.movie.findMany({
      where: movieWhereFilter,
      include: {
        movieCategories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        releaseYear: 'desc',
      },
      skip: offset,
      take: limit,
    });
    return {
      success: true,
      data: {
        movies,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      },
    };
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
      throw new NotFoundException('Movie not found');
    }
    const files = movie.movieFiles.map((file) => ({
      quality: file.quality,
      language: file.language,
      size_mb: Math.round(
        Buffer.byteLength(file.fileUrl || '', 'utf-8') / 1024 / 1024,
      ),
    }));
    const avgRating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, r) => acc + r.rating, 0) /
          movie.reviews.length
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
        categories: movie.movieCategories,
        files,
        reviews: {
          average_rating: Number(avgRating),
          count: movie.reviews.length,
        },
      },
    };
  }
}
