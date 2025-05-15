import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { SubscriptionType } from '@prisma/client';
import { VideoQuality } from '@prisma/client';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SubscriptionType)
  @IsOptional()
  subscription_type?: SubscriptionType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category_ids?: string[];
}

export class FileUploadDto {
  @IsEnum(VideoQuality)
  quality: VideoQuality;

  @IsString()
  language: string;
}
