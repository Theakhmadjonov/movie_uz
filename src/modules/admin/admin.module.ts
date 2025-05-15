import { Module } from '@nestjs/common';
import { AdminMoviesController } from './admin.controller';
import { AdminMoviesService } from './admin.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

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
  controllers: [AdminMoviesController],
  providers: [AdminMoviesService],
})
export class AdminModule {}
