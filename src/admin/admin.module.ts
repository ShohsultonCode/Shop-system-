import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import UsersSchema from 'src/models/users.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Users', schema: UsersSchema },
  ])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
