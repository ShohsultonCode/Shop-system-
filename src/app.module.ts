import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesModule } from './images/images.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://shohsultoncode:123326125@shop.iobzkwq.mongodb.net/?retryWrites=true&w=majority'),
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule,
    SharedModule,
    AuthModule,
    ImagesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
