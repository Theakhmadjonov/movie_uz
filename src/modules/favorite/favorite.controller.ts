import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import AuthGuard from 'src/common/guards/auth.guard';
import { Request } from 'express';

@Controller('favorite')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async getAllFavorites(@Req() req: Request) {
    try {
      const userId = req['userId'];
      return await this.favoriteService.getAllFavorite(userId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async addFavorite(@Body() movie_id: string, @Req() req: Request) {
    try {
      const userId = req['userId'];
      const data = await this.favoriteService.addfavorite(userId, movie_id);
      return data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':movie_id')
  async deleteFavorite(@Req() req: Request, @Param('movie_id') movie_id: string) {
    try {
      const userId = req['userId'];
      return await this.favoriteService.deleteFavorite(userId, movie_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
