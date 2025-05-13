import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  async seedAll() {
    await this.seedUsers();
  }
  async seedUsers() {
    this.logger.log('User seeders started');
    const username = this.configService.get('SUPER_USERNAME');
    const passwordHash = this.configService.get('SUPER_PASSWORDHASH');
    const email = this.configService.get('SUPER_EMAIL');
    const findExistsAdmin = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!findExistsAdmin) {
      const hashedPassword = await bcrypt.hash(passwordHash, 12);
      await this.prisma.user.create({
        data: {
          username,
          passwordHash: hashedPassword,
          email,
          role: 'superadmin',
        },
      });
      this.logger.log('User seeders ended');
    } else {
      this.logger.log('User seeders already exists');
      return true;
    }
  }
  async onModuleInit() {
    try {
      await this.seedAll();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
