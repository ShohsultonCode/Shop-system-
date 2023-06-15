import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Benefit, Category, Like, Product, UserCategory, Save, User, Sells } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose'
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly Users: Model<User>,
    @InjectModel('Benefits') private readonly Benefits: Model<Benefit>,
    @InjectModel('Categories') private readonly Categories: Model<Category>,
    @InjectModel('Usercategories') private readonly UserCategories: Model<UserCategory>,
    @InjectModel('Products') private readonly Products: Model<Product>,
    @InjectModel('Likes') private readonly Likes: Model<Like>,
    @InjectModel('Sells') private readonly Sells: Model<Sells>,
    @InjectModel('Saveds') private readonly Saveds: Model<Save>
  ) { }


  async userById(id: string): Promise<Object> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const user = await this.Users.findById(id).where('user_role', 'user')
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const findProducts = await this.Products.findOne({ product_owner: user.id })

    return { message: "Success", statusCode: 200, data: user, products: findProducts }
  }


  async allProducts(req: any): Promise<object> {
    const userId = req.user.id;
    const findUser = await this.Users.findById(userId).populate('user_categories');

    if (!findUser) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }
    const userCategories = findUser.user_categories;

    // Get the category IDs with category_status set to true
    const activeCategoryIds = userCategories
      .filter(category => category.category_status)
      .map(category => category.category);


    const products = await this.Products.find({ product_category: { $in: activeCategoryIds } })
      .populate('product_category');

    return { message: 'Success', statusCode: 200, data: products };
  }



  async allCategories(req: any): Promise<object> {
    const categories = await this.Categories.find({ category_status: true }).exec();
    return { message: 'Success', data: categories }
  }


  async ownCategories(req: any): Promise<object> {
    const userId = req.user.id;
    const user = await this.Users.findById(userId).populate({
      path: 'user_categories',
      populate: {
        path: 'category',
        match: { category_status: true },
      },
    });

    const ownCategories = user.user_categories.filter(
      (userCategory) => userCategory.category !== null
    );

    return { message: 'Success', statusCode: 200, data: ownCategories };
  }

  async updateOwnCategories(req: any, categoryId: string): Promise<object> {
    const userId = req.user.id;

    const user = await this.Users.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }


    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    // Find the category to update

    const categoryIndex = user.user_categories.findIndex(
      (userCategory) => userCategory.category.toString() === categoryId
    );


    if (categoryIndex === -1) {
      throw new NotFoundException('Category not found');
    }


    // Update the category_status to false
    user.user_categories[categoryIndex].category_status = false;

    await user.save();

    return { message: 'Category updated successfully', statusCode: 200 };
  }
  async sellProduct(req: any, productId: string): Promise<object> {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    console.log('Debug');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      console.log('Debug');

      const findProduct = await this.Products.findOne({ _id: productId, product_status: true }).populate('product_category');
      const findUser = await this.Users.findOne({ _id: userId, user_isactive: true });

      if (!findUser) {
        throw new HttpException('User Not Defined', HttpStatus.BAD_REQUEST);
      }

      if (!findProduct) {
        throw new HttpException('Product Not Defined', HttpStatus.BAD_REQUEST);
      }

      const Benefit = await this.Benefits.findOne();

      const productPrice = findProduct.product_price;

      if (findUser.user_payment < findProduct.product_price) {
        throw new HttpException('You do not have enough balance', HttpStatus.BAD_REQUEST);
      }

      findUser.user_payment -= productPrice;
      Benefit.benefit += productPrice;
      findProduct.product_count -= 1;

      const newSell = new this.Sells({
        sell_user: findUser._id,
        sell_product: findProduct._id,
        sell_price: productPrice,
      });

      await Promise.all([findUser.save(), findProduct.save(), Benefit.save(), newSell.save()]);

      await session.commitTransaction();
      session.endSession();

      return { message: 'Success', statusCode: 200 };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    } finally {
      // Bu qism "finally" blokini bajarish uchun
      // va tranzaksiya yakunlanishini ta'minlash uchun ishlatiladi
      // Bu erda kerakli bo'lgan boshqa amallar bajarilishi mumkin
      console.log('Transaction completed.');
      return { message: 'Success', statusCode: 200 };
    }
  }


}
