import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Benefit, Category, Like, Product, UserCategory, Save, User, Sells, Carts } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose'
import { productSeachDto } from 'src/admin/dto/product.seach.dto';

//ss}
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly Users: Model<User>,
  ) { }

  // async userById(req: any): Promise<object> {
  //   const { id } = req.user;

  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //     throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
  //   }

  //   const user = await this.Users.findById(id)
  //     .where('user_role', 'user')
  //     .populate({
  //       path: 'user_categories',
  //       select: 'category_name',
  //     });

  //   if (!user || !user.user_isactive) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }

  //   const findAllSells = await this.Sells.find({ sell_user: user.id }).populate('sell_product');
  //   if (!findAllSells) {
  //     throw new HttpException('Sells not found', HttpStatus.NOT_FOUND);
  //   }

  //   let ownProductCount = 0;
  //   findAllSells.forEach((sell) => {
  //     ownProductCount += sell.sell_product_count;
  //   });

  //   return {
  //     message: 'Success',
  //     statusCode: 200,
  //     data: user,
  //     status: {
  //       sells: findAllSells.length,
  //       ownproduct: findAllSells,
  //       ownproducts: ownProductCount
  //     },
  //   };
  // }
}





