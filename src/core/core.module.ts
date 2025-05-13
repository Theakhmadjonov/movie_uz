import { Module } from '@nestjs/common';
import { DatabaseMOdule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseMOdule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: './uploads',
    }),
    JwtModule.registerAsync({
        global: true,
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '1h',
          },
          inject: [ConfigService],
        }),
      }),
  ],
  exports: [],
})
export class CoreModule {}
