import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from 'src/users/dto/products.dto';
import { Benefit, Category, Like, Product, Save, Sells, User } from '../users/entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { UpdateProductDto } from 'src/users/dto/update-user.dto';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Users') private readonly Users: Model<User>,
    @InjectModel('Benefits') private readonly Benefits: Model<Benefit>,
    @InjectModel('Categories') private readonly Categories: Model<Category>,
    @InjectModel('Products') private readonly Products: Model<Product>,
    @InjectModel('Likes') private readonly Likes: Model<Like>,
    @InjectModel('Sells') private readonly Sells: Model<Sells>,
    @InjectModel('Saveds') private readonly Saveds: Model<Save>
  ) { }


  async addProducts(body: CreateProductDto, file: UploadedFileInter, req: any): Promise<Object> {
    const { product_name, product_description, product_count, product_price, product_category } = body;

    const findProductExists = await this.Products.findOne({ product_name: product_name.toLowerCase().trim() }).where("product_status", true);

    if (findProductExists) {
      throw new HttpException('Product name already exists', HttpStatus.NOT_FOUND);
    }

    if (!mongoose.Types.ObjectId.isValid(product_category)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const checkCategory = await this.Categories.findById(product_category).where('category_status', true);

    if (!checkCategory) {
      throw new HttpException('Category not found or inactive', HttpStatus.NOT_FOUND);
    }

    if (!file) {
      throw new HttpException('Product Image is required', HttpStatus.NOT_FOUND);
    }

    const newProduct = new this.Products({
      product_name: product_name.toLowerCase().trim(),
      product_description: product_description,
      product_category: product_category, // Assign the product_category
      product_count: product_count,
      product_price: product_price,
      product_image: file.filename,
    });

    await newProduct.save();

    return { message: 'Success', statusCode: 201, data: newProduct };
  }


  async allProducts(): Promise<Object> {
    const allProducts = await this.Products.find({ product_status: true }).populate('product_category')
    //sss
    const checkCategoryStatus = allProducts.filter(product => product.product_category && product.product_category.category_status === true).reverse()
    return { message: "Success", statusCode: 200, products: checkCategoryStatus }
  }



  async product(id: string): Promise<Object> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const product = await this.Products.findById(id).populate('product_category')

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }

    const checkStatus = product.product_category.category_status

    if (!checkStatus) {
      throw new HttpException('Category status does not work', HttpStatus.NOT_FOUND);
    }

    if (!product.product_status) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }

    return { message: "Success", statusCode: 200, products: product }
  }

  //Update a product

  async updateProduct(id: string, body: UpdateProductDto, file: UploadedFileInter): Promise<Object> {
    const { product_name, product_description, product_count, product_category, product_price } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }
    if (product_category) {
      if (!mongoose.Types.ObjectId.isValid(product_category)) {
        throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
      }
    }

    if (product_category) {
      const findProductCategory = await this.Categories.findById(product_category)


      if (!findProductCategory) {
        throw new HttpException('category not found', HttpStatus.BAD_REQUEST);
      }
      if (findProductCategory.category_status === false) {
        throw new HttpException('category is off', HttpStatus.BAD_REQUEST);
      }
    }

    const product = await this.Products.findById(id)

    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
    }

    if (file) {
      product.product_image = file.filename
    }
    if (product_name) {
      product.product_name = product_name.toLowerCase().trim()
    }

    if (product_description) {
      product.product_description = product_description.trim()
    }

    if (product_count) {
      product.product_count = Number(product_count);
    }
    if (product_price) {
      product.product_price = Number(product_price);
    }

    //s


    await product.save()

    return { message: "Success", statusCode: 200 }
  }



  async deleteProduct(id: string): Promise<Object> {
    const product = await this.Products.findById(id)

    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
    }

    product.product_status = false;

    await product.save()

    return { message: 'Success', statusCode: 200 }
  }


  async allSells(): Promise<Object> {
    const allSells = await this.Sells.find()
    return { message: "Success", statusCode: 200, data: allSells }
  }


  //Dashboard

  async dashboards(): Promise<Object> {
    const allSells = (await this.Sells.find()).length
    const allBenefits = await this.Benefits.findOne()
    const allProducts = (await this.Products.find({ product_status: true })).length
    const allUsers = (await this.Users.find()).length
    return {
      message: "Success", statusCode: 200, data: {
        alluser: allUsers,
        allProducts: allProducts,
        allsells: allSells,
        allbenefits: allBenefits.benefit
      }
    }
  }

  async allUsers(): Promise<object> {
    ///ss
    const allUsers = await this.Users.find({ user_role: "user", user_isactive: true })
    return { message: "Success", statusCode: 200, data: allUsers }
  }

}

