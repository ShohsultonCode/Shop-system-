import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Benefit, Category, Like, Product, UserCategory, Save, User, Sells, Carts } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose'
import { productSeachDto } from 'src/admin/dto/product.seach.dto';
import { cartDto } from './dto/cart.dto';
import { BuycartDto } from './dto/buycart';
import { contactDto } from './dto/contact.dto';

//ss}
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
    @InjectModel('Carts') private readonly Carts: Model<Carts>,
    @InjectModel('Saveds') private readonly Saveds: Model<Save>
  ) { }

  async userById(req: any): Promise<object> {
    const { id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const user = await this.Users.findById(id)
      .where('user_role', 'user')
      .populate({
        path: 'user_categories',
        select: 'category_name',
      });

    if (!user || !user.user_isactive) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const findAllSells = await this.Sells.find({ sell_user: user.id }).populate('sell_product');
    if (!findAllSells) {
      throw new HttpException('Sells not found', HttpStatus.NOT_FOUND);
    }

    let ownProductCount = 0;
    findAllSells.forEach((sell) => {
      ownProductCount += sell.sell_product_count;
    });

    return {
      message: 'Success',
      statusCode: 200,
      data: user,
      status: {
        sells: findAllSells.length,
        ownproduct: findAllSells,
        ownproducts: ownProductCount
      },
    };
  }




  async lastProducts(): Promise<object> {
    const lastThreeProducts = await this.Products.find({ product_status: true, product_count: { $gt: 0 }, })
      .populate('product_category')
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .limit(3); // Limit the result to three

    return { message: "Success", statusCode: 200, data: lastThreeProducts }
  }
  async defaultPage(req: any): Promise<object> {
    const limitPage = 1;
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (limitPage - 1) * perPage; // Calculate the number of products to skip

    const userId = req.user.id;

    const findUser = await this.Users.findById(userId)

    const userCategories = findUser.user_categories;

    // Get the category IDs with category_status set to true
    const activeCategoryIds = userCategories
      .filter(category => category.category_status)
      .map(category => category.category);

    const totalProductsCount = await this.Products.countDocuments({ product_category: { $in: activeCategoryIds } }); // Get the total count of products for the active categories

    const products = await this.Products.find({ product_category: { $in: activeCategoryIds } })
      .populate('product_category')
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


  async getProductId(req: any, productId: string): Promise<object> {

    const userId = req.user.id;



    const products = await this.Products.findById(productId)
      .populate('product_category')

    if (!products) {
      throw new HttpException('Product Not Defiend', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Success',
      statusCode: 200,
      data: products,
    };
  }


  //No aActions

  async paginationProducts(page: number, req: any): Promise<object> {
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (page - 1) * perPage; // Calculate the number of products to skip

    const userId = req.user.id;

    const findUser = await this.Users.findById(userId)

    const userCategories = findUser.user_categories;

    const activeCategoryIds = userCategories
      .filter(category => category.category_status)
      .map(category => category.category);

    const totalProductsCount = await this.Products.countDocuments({ product_category: { $in: activeCategoryIds } }); // Get the total count of products for the active categories
    const products = await this.Products.find({
      product_category: { $in: activeCategoryIds },
      product_status: true,
      product_count: { $gt: 0 }
    })
      .populate('product_category')
      .skip(skipCount)
      .limit(perPage);




    return {
      message: 'Success',
      statusCode: 200,
      products: products,
      currentPage: page,
      totalPages: Math.ceil(totalProductsCount / perPage),
    };
  }


  async searchProducts(productName: productSeachDto, req: any): Promise<object> {
    const userId = req.user.id;

    const { product_name } = productName
    console.log(product_name);

    // Retrieve the user's categories with category_status set to true

    const findUser = await this.Users.findById(userId)





    const activeCategoryIds = findUser.user_categories
      .filter(category => category.category_status)
      .map(category => category.category);

    const totalProductsCount = await this.Products.countDocuments({ product_category: { $in: activeCategoryIds } }); // Get the total count of products for the active categories
    // Filter products by matching the product_name using regex and user's active categories
    const products = await this.Products.find({
      product_name: { $regex: product_name, $options: 'i' },
      product_category: { $in: activeCategoryIds },
      product_status: true,
      product_count: { $gt: 0 }
    }).populate('product_category')


    return {
      message: 'Success', statusCode: 200, data: products, totalPages: Math.ceil(totalProductsCount / 6)
    };

  }

  async ownProducts(req: any): Promise<object> {
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


    const products = await this.Products.find({
      product_category: { $in: activeCategoryIds },
      product_count: { $gt: 0 },
      product_status: true
    })
      .populate('product_category')

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

    // Toggle the category_status
    user.user_categories[categoryIndex].category_status = !user.user_categories[categoryIndex].category_status;

    await user.save();


    return { message: 'Category updated successfully', statusCode: 200 };
  }


  async sellProduct(req: any, productId: string): Promise<object> {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }
    const findProduct = await this.Products.findById(productId).populate('product_category')


    const findUser = await this.Users.findById(userId);

    if (!findUser) {
      throw new HttpException('User Not Defined', HttpStatus.BAD_REQUEST);
    }


    if (!findProduct || !findProduct.product_status || findProduct.product_count === 0) {
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
      sell_product_count: 1
    });

    await Promise.all([findUser.save(), findProduct.save(), Benefit.save(), newSell.save()]);

    return { message: 'Success', statusCode: 200 };
  }




  //No auth
  async defaultPageNoAuth(): Promise<object> {
    const limitPage = 1;
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (limitPage - 1) * perPage; // Calculate the number of products to skip

    const totalProductsCount = await this.Products.countDocuments(); // Get the total count of products

    const products = await this.Products.find({ product_status: true, product_count: { $gt: 0 }, })
      .populate('product_category')
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

  //ss

  async paginationProductsNoAuth(page: number): Promise<object> {
    const perPage = 6; // Number of products to fetch per page
    const skipCount = (page - 1) * perPage; // Calculate the number of products to skip

    const totalProductsCount = await this.Products.countDocuments(); // Get the total count of products

    const products = await this.Products.find({ product_status: true, product_count: { $gt: 0 } })
      .populate('product_category')
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

  async searchProductsNoAuth(productName: productSeachDto): Promise<object> {

    const { product_name } = productName

    // Retrieve the user's categories with category_status set to true


    const products = await this.Products.find({
      product_name: { $regex: product_name, $options: 'i' },
      product_status: true,
      product_count: { $gt: 0 },
    }).populate('product_category')


    if (products.length > 0) {
      return { message: 'Success', statusCode: 200, data: products };
    } else {
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);

    }
  }




  async getProductNoAuth(id: string): Promise<Object> {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const product = await this.Products.findById(id).populate('product_category')

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
    }

    const checkStatus = product.product_category

    if (!checkStatus) {
      throw new HttpException('Category status does not work', HttpStatus.NOT_FOUND);
    }

    return { message: "Success", statusCode: 200, data: product }
  }

  async addCart(req: any, body: cartDto) {
    const { id } = req.user;


    const { cart_product } = body

    if (!mongoose.Types.ObjectId.isValid(cart_product)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const findUser = await this.Users.findById(id);
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const activeCategoryIds = findUser.user_categories
      .filter(category => category.category_status)
      .map(category => category.category);

    const findProduct = await this.Products.findOne({
      _id: cart_product,
      product_category: { $in: activeCategoryIds },
    });

    if (!findProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const findCart = await this.Carts.findOne({ cart_product: findProduct.id, cart_user: findUser.id })

    if (findCart) {
      throw new HttpException('Product is already in cart', HttpStatus.NOT_FOUND);
    }
    const newCart = new this.Carts({
      cart_user: findUser.id,
      cart_product: findProduct.id,
    });

    await newCart.save();

    return { message: 'Success', statusCode: HttpStatus.CREATED };
  }

  async removeCart(req: any, cartId: string) {
    const { id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new HttpException('ID is not valid', HttpStatus.BAD_REQUEST);
    }

    const findUser = await this.Users.findById(id);
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }


    const findCart = await this.Carts.findByIdAndDelete(cartId);

    if (!findCart) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Success', statusCode: HttpStatus.OK };
  }


  async allCarts(req: any) {
    const { id } = req.user;


    const findUser = await this.Users.findById(id);
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }


    const findCarts = await this.Carts.find().populate('cart_product')

    return { message: 'Success', statusCode: HttpStatus.OK, data: findCarts };
  }



  async buyProductInCart(req: any, body: BuycartDto): Promise<Object> {
    const { buy_product } = body;

    try {
      const userId = req.user.id;

      for (const item of buy_product) {
        const { product_id, product_count } = item as { product_id: string, product_count: number };

        if (!mongoose.Types.ObjectId.isValid(product_id)) {
          throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
        }

        const findProduct = await this.Products.findOne({ _id: product_id, product_status: true });

        if (!findProduct) {
          throw new HttpException(`Product not found for ID: ${product_id}`, HttpStatus.NOT_FOUND);
        }


        if (findProduct.product_count < product_count) {
          throw new HttpException(`Prooduct count is: ${findProduct.product_count}`, HttpStatus.NOT_FOUND);
        }

        const findUser = await this.Users.findOne({ _id: userId, user_isactive: true });

        if (!findUser) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const Benefit = await this.Benefits.findOne();

        const productPrice = findProduct.product_price;

        if (findUser.user_payment < productPrice * product_count) {
          throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
        }

        findUser.user_payment -= productPrice * product_count;
        Benefit.benefit += productPrice * product_count;
        findProduct.product_count -= product_count;

        const newSell = new this.Sells({
          sell_user: findUser._id,
          sell_product: findProduct._id,
          sell_price: productPrice,
          sell_product_count: product_count
        });

        await Promise.all([findUser.save(), findProduct.save(), Benefit.save(), newSell.save()]);
      }

      // Delete user's cart
      await this.Carts.deleteMany({ cart_user: userId });

      // Return a success message or desired response
      return { message: 'Cart items purchased successfully and cart deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async addContact(body: contactDto): Promise<object> {
    const { user_first_name, user_last_name, user_message, user_subject } = body;
    const token = process.env.BOT_TOKEN;
    const id = 5171708849;
    const mytext = `👤User First Name: ${user_first_name}, 👤User Last Name: ${user_last_name}, 🎢 Subject:${user_subject} 💬About:  ${user_message}`;
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${encodeURIComponent(mytext)}`;

    try {
      await fetch(url, { method: 'POST' });
      return { message: 'Success', statusCode: HttpStatus.OK };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.NOT_FOUND);
    }
  }

}





