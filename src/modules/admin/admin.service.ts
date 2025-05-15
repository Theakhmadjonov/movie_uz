import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie, MovieFile } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateMovieDto } from './dto/create-admin.dto';
import { FileUploadDto, UpdateMovieDto } from './dto/update-admin.dto';

@Injectable()
export class AdminMoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMovies() {
    const movies = await this.prisma.movie.findMany({
      include: {
        movieCategories: {
          select: { category: { select: { name: true } } },
        },
      },
    });
    const total = await this.prisma.movie.count();
    return {
      success: true,
      data: {
        movies: movies.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          slug: movie.slug,
          release_year: movie.releaseYear,
          subscription_type: movie.subscriptionType,
          view_count: movie.viewCount,
          review_count: movie.reviews.length,
          created_at: movie.createdAt,
          created_by: movie.users[0]?.username,
        })),
        total,
      },
    };
  }

  async createMovie(createMovieDto: CreateMovieDto, userId: string) {
    const {
      title,
      description,
      release_year,
      duration_minutes,
      subscription_type,
      category_ids,
      poster,
    } = createMovieDto;
    const movie = await this.prisma.movie.create({
      data: {
        title,
        description,
        releaseYear: release_year,
        durationMinutes: duration_minutes,
        subscriptionType: subscription_type,
        slug: title,
        createdById: userId,
        movieCategories: {
          create: category_ids.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });
    return {
      success: true,
      message: 'Movie successfully added',
      data: {
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        created_at: movie.createdAt,
      },
    };
  }

  async updateMovie(movieId: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    const updatedMovie = await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        ...updateMovieDto,
      },
    });
    return {
      success: true,
      message: 'Movie successfully updated',
      data: {
        updatedMovie,
      },
    };
  }

  async deleteMovie(movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    await this.prisma.movie.delete({
      where: { id: movieId },
    });
    return {
      success: true,
      message: 'Movie successfully deleted',
    };
  }

  async uploadFile(
    movieId: string,
    fileUploadDto: FileUploadDto,
    file: Express.Multer.File,
  ) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    const uploadedFile: MovieFile = await this.prisma.movieFile.create({
      data: {
        movieId: movieId,
        fileUrl: file.originalname,
        quality: fileUploadDto.quality,
        language: fileUploadDto.language,
      },
    });
    return {
      success: true,
      message: 'Movie successfully uploaded',
      data: {
        id: uploadedFile.id,
        movie_id: uploadedFile.movieId,
        quality: uploadedFile.quality,
        language: uploadedFile.language,
        size_mb: Math.round(file.size / 1024 / 1024),
        file_url: uploadedFile.fileUrl,
      },
    };
  }
}
