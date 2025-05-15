import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  durationDays: number;

  @IsArray()
  features: string[];

  @IsBoolean()
  isActive: boolean;
}

export class UpdateSubscriptionPlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
