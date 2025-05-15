import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  SetMetadata,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import AuthGuard from 'src/common/guards/auth.guard';
import RoleGuard from 'src/common/guards/role.guard';
import {
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from './dto/create-subscription.dto';
import { Request } from 'express';
import { PurchaseSubscriptionDto } from './dto/purchse-subs.dto';

@Controller('api/subscription')
@UseGuards(AuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionService.getActivePlans();
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Get('plans/all')
  getAllPlans() {
    try {
      return this.subscriptionService.getAllPlans();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Post('plans')
  createPlan(@Body() dto: CreateSubscriptionPlanDto) {
    try {
      return this.subscriptionService.createPlan(dto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('purchase')
  async purchaseSubscription(
    @Req() req: Request,
    @Body() dto: PurchaseSubscriptionDto,
  ) {
    try {
      const userId = req['userId'];
      return this.subscriptionService.purchaseSubscription(userId, dto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Patch('plans/:id')
  updatePlan(@Param('id') id: string, @Body() dto: UpdateSubscriptionPlanDto) {
    try {
      return this.subscriptionService.updatePlan(id, dto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Delete('plans/:id')
  deletePlan(@Param('id') id: string) {
    try {
      return this.subscriptionService.deletePlan(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
