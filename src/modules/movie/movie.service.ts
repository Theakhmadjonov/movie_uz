import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { GetMoviesDto } from './dto/get-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getMovies(query: GetMoviesDto) {
    let { page, limit, category, search, subscription_type } = query;
    page = Number(query.page) || 1;
    limit = Number(query.limit) || 20;
    const offset = (page - 1) * limit;
    if (!search || !category || !subscription_type) {
      return {
        success: false,
        message: 'Search, category, subscription_type are required.',
      };
    }
    const movies = await this.prisma.$queryRaw`
        SELECT
            m.id,
            m.title,
            m.slug,
            m."posterUrl",
            m."releaseYear",
            m.rating,
            m."subscriptionType",
                ARRAY_AGG(c.name) AS categories
        FROM "movies" m
            JOIN "movieCategories" mc ON m.id = mc."movieId"
            JOIN "categories" c ON mc."categoryId" = c.id
        WHERE
            LOWER(m.title) LIKE LOWER('%' || ${search} || '%')
            AND LOWER(c.name) = LOWER(${category})
            AND m."subscriptionType" = ${subscription_type}
        GROUP BY m.id
        ORDER BY m."releaseYear" DESC
            LIMIT ${limit}
            OFFSET ${offset};
    `;

    const totalResult: any = await this.prisma.$queryRaw`
    SELECT COUNT(DISTINCT m.id) AS total
    FROM "movies" m
    JOIN "movieCategories" mc ON m.id = mc."movieId"
    JOIN "categories" c ON mc."categoryId" = c.id
    WHERE
      LOWER(m.title) LIKE LOWER('%' || ${search} || '%')
      AND LOWER(c.name) = LOWER(${category})
      AND m."subscriptionType" = ${subscription_type};
  `;
    const total = Number(totalResult[0]?.total || 0);
    const pages = Math.ceil(total / limit);
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
