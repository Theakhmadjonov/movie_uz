import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import AuthGuard from 'src/common/guards/auth.guard';
import RoleGuard from 'src/common/guards/role.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.register(dto);
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.login(dto);
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('role')
  @UseGuards(AuthGuard, RoleGuard)
  @SetMetadata('roles', ['superadmin'])
  async addRoleAdminForUser(@Body() userId: string) {
    try {
      const updatedRole = await this.authService.addRole(userId);
      return updatedRole;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return {
      message: 'Muvaffaqiyatli tizimdan chiqildi',
    };
  }
}
