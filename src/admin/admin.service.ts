import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Benefit, Category, Like, Product, Save, Sells, User } from '../users/entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { productSeachDto } from './dto/product.seach.dto';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Users') private readonly Users: Model<User>,
  ) { }




  // async allProducts(): Promise<Object> {
  //   const allProducts = await this.Products.find({ product_status: true }).populate('product_category')
  //   //sss
  //   const checkCategoryStatus = allProducts.filter(product => product.product_category && product.product_category.category_status === true).reverse()
  //   return { message: "Success", statusCode: 200, products: checkCategoryStatus }
  // }
}

