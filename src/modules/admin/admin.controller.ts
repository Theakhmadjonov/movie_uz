import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  SetMetadata,
  HttpStatus,
  HttpException,
  Req,
} from '@nestjs/common';
import { AdminMoviesService } from './admin.service';
import AuthGuard from 'src/common/guards/auth.guard';
import { CreateMovieDto } from './dto/create-admin.dto';
import { FileUploadDto, UpdateMovieDto } from './dto/update-admin.dto';
import RoleGuard from 'src/common/guards/role.guard';
import { Request } from 'express';

@Controller('api/admin/movies')
@UseGuards(AuthGuard)
export class AdminMoviesController {
  constructor(private readonly moviesService: AdminMoviesService) {}

  @Get()
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async getMovies() {
    try {
      return await this.moviesService.getMovies();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() poster: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      const userId = req['userId'];
      return await this.moviesService.createMovie(createMovieDto, userId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':movie_id')
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async updateMovie(
    @Param('movie_id') movieId: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    try {
      return await this.moviesService.updateMovie(movieId, updateMovieDto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':movie_id')
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async deleteMovie(@Param('movie_id') movieId: string) {
    try {
      return await this.moviesService.deleteMovie(movieId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':movie_id/files')
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async uploadFile(
    @Param('movie_id') movieId: string,
    @Body() fileUploadDto: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.moviesService.uploadFile(movieId, fileUploadDto, file);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
