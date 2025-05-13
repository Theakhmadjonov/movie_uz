import { Module } from '@nestjs/common';
import { DatabaseMOdule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseMOdule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  exports: [],
})
export class CoreModule {}
