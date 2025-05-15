import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionController } from './subscriptions.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        filename: (req, file, callback) => {
          const extName = path.extname(file.originalname);
          const fileName = `${uuid()}${extName}`;
          req['fileName'] = fileName;
          callback(null, fileName);
        },
        destination: './uploads',
      }),
    }),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionsModule {}
