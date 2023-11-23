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
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://shohsulton3039:NYyMzVeJeUix9vBD@discover.xhevfxo.mongodb.net/'),
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule,
    SharedModule,
    AuthModule,
    ImagesModule,
    AdminModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
