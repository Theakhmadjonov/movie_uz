import { Module } from '@nestjs/common';
import { DatabaseMOdule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

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
  ],
  exports: [],
})
export class CoreModule {}
