import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import {
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from './dto/create-subscription.dto';
import { PurchaseSubscriptionDto } from './dto/purchse-subs.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getActivePlans() {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
    });
    return {
      success: true,
      data: plans,
    };
  }

  async getAllPlans() {
    const plans = await this.prisma.subscriptionPlan.findMany();
    return {
      success: true,
      data: plans,
    };
  }

  async purchaseSubscription(userId: string, dto: PurchaseSubscriptionDto) {
    const { plan_id, payment_method, auto_renew, payment_details } = dto;
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: plan_id },
    });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    const paymentStatus = 'completed'; 
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationDays);
    const subscription = await this.prisma.userSubscription.create({
      data: {
        userId: userId,
        planId: plan_id,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        autoRenew: auto_renew,
      },
    });
    const payment = await this.prisma.payment.create({
      data: {
        userSubscriptionId: subscription.id,
        amount: plan.price,
        paymentMethod: payment_method,
        paymentDetails: payment_details,
        status: paymentStatus,
        externalTransactionId: subscription.id,
      },
    });

    return {
      success: true,
      message: 'Subscription successfully purchased',
      data: {
        subscription: {
          id: subscription.id,
          plan: { id: plan_id, name: plan.name },
          start_date: startDate,
          end_date: endDate,
          status: subscription.status,
          auto_renew: subscription.autoRenew,
        },
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          external_transaction_id: payment.externalTransactionId,
          payment_method: payment.paymentMethod,
        },
      },
    };
  }

  async createPlan(dto: CreateSubscriptionPlanDto) {
    const plan = await this.prisma.subscriptionPlan.create({
      data: {
        name: dto.name,
        price: dto.price,
        durationDays: dto.durationDays,
        features: dto.features,
        isActive: dto.isActive,
      },
    });
    return {
      success: true,
      message: 'SubscriptionPlan created',
      data: plan,
    };
  }

  async updatePlan(id: string, dto: UpdateSubscriptionPlanDto) {
    const updated = await this.prisma.subscriptionPlan.update({
      where: { id },
      data: dto,
    });
    return {
      success: true,
      message: 'SubscriptionPlan updated',
      data: updated,
    };
  }

  async deletePlan(id: string) {
    await this.prisma.subscriptionPlan.delete({
      where: { id },
    });
    return {
      success: true,
      message: `SubscriptionPlan deleted`,
    };
  }
}
