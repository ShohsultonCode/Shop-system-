import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import UsersSchema from 'src/models/users.schema';
import BenefitSchema from 'src/models/benefit.schema';
import ProductSchema from 'src/models/products.schema';
import CategorySchema from 'src/models/categpries.schema';
import LikeSchema from 'src/models/like.schema';
import SaveSchema from 'src/models/saveds.schema';
import UserCategoriesSchema from 'src/models/user.categories.schema';
import SellSchema from 'src/models/sell.schema';
import CartSchema from 'src/models/cart.schema';



@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Users', schema: UsersSchema },
    { name: 'Products', schema: ProductSchema },
    { name: 'Categories', schema: CategorySchema },
    { name: 'Usercategories', schema: UserCategoriesSchema },
    { name: 'Benefits', schema: BenefitSchema },
    { name: 'Carts', schema: CartSchema },
    { name: 'Likes', schema: LikeSchema },
    { name: 'Saveds', schema: SaveSchema },
    { name: 'Sells', schema: SellSchema },
  ])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
