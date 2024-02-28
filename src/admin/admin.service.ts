import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from 'src/users/dto/products.dto';
import { Benefit, Category, Like, Product, Save, Sells, User } from '../users/entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { UpdateProductDto } from 'src/users/dto/update-user.dto';
import { productSeachDto } from './dto/product.seach.dto';
import { CategoryDto } from 'src/users/dto/categories.dto';
import CategorySchema from 'src/models/categpries.schema';
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
    const allProducts = (await this.Products.find({ product_status: true }))

    let s = 0;
    allProducts.filter((product) => {
      s += product.product_count
    })
    const allUsers = (await this.Users.find()).length
    return {
      message: "Success", statusCode: 200, data: {
        alluser: allUsers,
        allProducts: s,
        allsells: allSells,
        allbenefits: allBenefits.benefit
      }
    }
  }

  async allUsers(): Promise<object> {
    //
    const allUsers = await this.Users.find({ user_role: "user", user_isactive: true })
    return { message: "Success", statusCode: 200, data: allUsers }
  }

  async sellPagination(page: number): Promise<object> {
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (page - 1) * perPage; // Calculate the number of products to skip

    const totalProductsCount = await this.Sells.countDocuments(); // Get the total count of products

    const products = await this.Sells.find()
      .populate('sell_user')
      .populate('sell_product')
      .skip(skipCount)
      .limit(perPage);

    return {
      message: 'Success',
      statusCode: 200,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProductsCount / perPage),
    };
  }

  async defaultSell(): Promise<object> {
    const limitPage = 1;
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (limitPage - 1) * perPage; // Calculate the number of products to skip

    const totalProductsCount = await this.Sells.countDocuments(); // Get the total count of products

    const products = await this.Sells.find()
      .populate('sell_user')
      .populate('sell_product')
      .skip(skipCount)
      .limit(perPage);

    return {
      message: 'Success',
      statusCode: 200,
      products,
      currentPage: limitPage,
      totalPages: Math.ceil(totalProductsCount / perPage),
    };
  }

  async searchProductsNoAuth(productName: productSeachDto): Promise<object> {

    const { product_name } = productName

    // Retrieve the user's categories with category_status set to true


    const products = await this.Users.find({
      user_first_name: { $regex: product_name, $options: 'i' },
      user_isactive: true,
    })


    if (products.length > 0) {
      return { message: 'Success', statusCode: 200, data: products };
    } else {
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
    }
  }


  async defaultUser(): Promise<object> {
    const limitPage = 1;
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (limitPage - 1) * perPage; // Calculate the number of products to skip

    const totalProductsCount = await this.Users.countDocuments(); // Get the total count of products

    const products = await this.Users.find({ user_role: "user" })
      .skip(skipCount)
      .limit(perPage);

    return {
      message: 'Success',
      statusCode: 200,
      products,
      currentPage: limitPage,
      totalPages: Math.ceil(totalProductsCount / perPage),
    };
  }
  async userPagination(page: number): Promise<object> {
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (page - 1) * perPage; // Calculate the number of products to skip

    const totalProductsCount = await this.Users.countDocuments(); // Get the total count of products

    const products = await this.Users.find({ user_role: "user" })
      .skip(skipCount)
      .limit(perPage);

    return {
      message: 'Success',
      statusCode: 200,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProductsCount / perPage),
    };
  }

  //categories

  async addCategory(body: CategoryDto, file: UploadedFileInter, req: any): Promise<Object> {
    const { category_name } = body
    if (!file) {
      throw new HttpException('Category Image is required', HttpStatus.NOT_FOUND);
    }

    const checkNameofCategory = await this.Categories.findOne({
      category_name:category_name.toLowerCase()
    })
    if (checkNameofCategory) {
      throw new HttpException('Category already exsist', HttpStatus.BAD_REQUEST);
    }
    const newCategory = await this.Categories.create({
      category_name: category_name.toLowerCase(),
      category_status: true,
      category_image: file.filename
    })

    return {
      message: 'Success',
      statusCode: 200,
    }
  }

  async getCategories(req: any): Promise<Object> {
    const categories = await this.Categories.find()

    return {
      message: 'Success',
      statusCode: 200,
      categories:categories
    }
  }

}




