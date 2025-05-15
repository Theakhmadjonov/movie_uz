import { IsArray, IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  release_year: number;

  @IsInt()
  duration_minutes: number;

  @IsEnum(SubscriptionType)
  subscription_type: SubscriptionType;

  @IsArray()
  @IsString({ each: true })
  category_ids: string[];

  @IsOptional()
  poster: Express.Multer.File;
}
