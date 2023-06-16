import { UploadedFile, UseInterceptors, Controller, Put, Get, Post, Body, Res, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateProductDto } from './dto/products.dto';
import { fileUploadInterceptor } from 'src/utils/file.catch';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateUserCategoriesDto } from './dto/category.dto';
import { IsNumber } from 'class-validator';
import { productSeachDto } from 'src/admin/dto/product.seach.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  userById(@Req() req: any) {
    return this.usersService.userById(req);
  }

  //sss
  @Get('lastproducts')
  lastProducts() {
    return this.usersService.lastProducts();
  }

  @Get('defaultpage')
  @UseGuards(JwtAuthGuard)
  defaultProducts(@Req() req: any) {
    return this.usersService.defaultPage(req);
  }
  @Get('userproduct/:id')
  @UseGuards(JwtAuthGuard)
  getProductId(@Req() req: any, @Param('id') id: string,) {
    return this.usersService.getProductId(req, id);
  }

  @Get('productspagination/:id')
  @UseGuards(JwtAuthGuard)
  products(@Param('id') id: number, @Req() req: any) {
    return this.usersService.paginationProducts(id, req);
  }


  @Post('filter/products')
  @UseGuards(JwtAuthGuard)
  filterProducts(@Body() productname: productSeachDto, @Req() req: any) {
    return this.usersService.searchProducts(productname, req);
  }


  @Post('noauthfilter/products')
  NoauthfilterProducts(@Body() productname: productSeachDto) {
    return this.usersService.searchProductsNoAuth(productname);
  }

  @Get('ownproducts')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.usersService.ownProducts(req);
  }

  @Get('categories')
  categories(@Req() req: any) {
    return this.usersService.allCategories(req);
  }

  @Get('owncategories')
  @UseGuards(JwtAuthGuard)
  owncategories(@Req() req: any) {
    return this.usersService.ownCategories(req);
  }

  @Put('updateowncategories/:id')
  @UseGuards(JwtAuthGuard)
  updateowncategories(@Req() req: any, @Param('id') id: string) {
    return this.usersService.updateOwnCategories(req, id);
  }


  @Post('sell/:id')
  @UseGuards(JwtAuthGuard)
  async sellProduct(@Req() req: any, @Param('id') id: string) {
    return this.usersService.sellProduct(req, id);
  }



  //For Carts







  //No Auth
  @Get('facepage')
  defaultProductsNoAuth(@Req() req: any) {
    return this.usersService.defaultPageNoAuth();
  }

  @Get('pacepagination/:id')
  productsNoAuth(@Param('id') id: number, @Req() req: any) {
    return this.usersService.paginationProductsNoAuth(id);
  }

  @Get('noauthproduct/:id')
  @UseGuards(JwtAuthGuard)
  NoauthgetProductId(@Param('id') id: string) {
    return this.usersService.getProductNoAuth(id);
  }
}



