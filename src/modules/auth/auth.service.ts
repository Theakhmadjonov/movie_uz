import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (existingUser) throw new ForbiddenException('User already exists');
    const hash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash: hash,
      },
    });
    const token = this.jwtService.sign({ user_id: user.id });
    return {
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.createdAt,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        subscriptions: {
          where: { status: 'active' },
          orderBy: { endDate: 'desc' },
          take: 1,
          include: { plan: true },
        },
      },
    });
    if (!user) throw new ForbiddenException('Email or password is incorrect');
    const comparePassword = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!comparePassword)
      throw new ForbiddenException('Email or password is incorrect');
    const token = this.jwtService.sign({ user_id: user.id });
    const subscription = user.subscriptions[0];
    const planName = subscription?.plan?.name || 'Free';
    const expiresAt = subscription?.endDate || null;
    return {
      message: 'Muvaffaqiyatli kirildi',
      data: {
        user_id: user.id,
        username: user.username,
        role: user.role,
        subscription: {
          plan_name: planName,
          expires_at: expiresAt,
        },
      },
      token,
    };
  }
}
