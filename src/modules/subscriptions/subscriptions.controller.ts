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
  async getPlans() {
    return await this.subscriptionService.getActivePlans();
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Get('plans/all')
  async getAllPlans() {
    try {
      return await this.subscriptionService.getAllPlans();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Post('plans')
  async createPlan(@Body() dto: CreateSubscriptionPlanDto) {
    try {
      return await this.subscriptionService.createPlan(dto);
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
      return await this.subscriptionService.purchaseSubscription(userId, dto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Patch('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() dto: UpdateSubscriptionPlanDto) {
    try {
      return await this.subscriptionService.updatePlan(id, dto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  @Delete('plans/:id')
  async deletePlan(@Param('id') id: string) {
    try {
      return await this.subscriptionService.deletePlan(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
