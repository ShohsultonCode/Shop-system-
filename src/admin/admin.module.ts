import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import UsersSchema from 'src/models/users.schema';
import ProductSchema from 'src/models/products.schema';
import CategorySchema from 'src/models/categpries.schema';
import BenefitSchema from 'src/models/benefit.schema';
import LikeSchema from 'src/models/like.schema';
import SaveSchema from 'src/models/saveds.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Users', schema: UsersSchema },
    { name: 'Products', schema: ProductSchema },
    { name: 'Categories', schema: CategorySchema },
    { name: 'Benefits', schema: BenefitSchema },
    { name: 'Likes', schema: LikeSchema },
    { name: 'Saveds', schema: SaveSchema },
  ])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
