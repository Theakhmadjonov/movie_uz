import { IsBoolean, IsEnum, IsObject, IsOptional, IsString } from "class-validator";

enum PaymentMethod {
  card = 'card',
  paypal = 'paypal',
  bank_transfer = 'bank_transfer',
  crypto = 'crypto',
}

export class PurchaseSubscriptionDto {
  @IsString()
  plan_id: string;

  @IsEnum(PaymentMethod)  
  payment_method: PaymentMethod;

  @IsBoolean()
  auto_renew: boolean;

  @IsOptional()
  @IsObject()
  payment_details: {
    card_number: string;
    expiry: string;
    card_holder: string;
  };
}
