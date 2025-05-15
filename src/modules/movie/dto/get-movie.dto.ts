import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';

export class GetMoviesDto {
  @IsOptional()
  @IsInt()
  page: number;

  @IsOptional()
  @IsInt()
  limit: number;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum(['free', 'premium'])
  subscription_type: string;
}
