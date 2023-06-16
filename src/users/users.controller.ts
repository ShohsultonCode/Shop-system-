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

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  userById(@Param('id') id: string) {
    return this.usersService.userById(id);
  }


  @Get('lastproducts')
  lastProducts() {
    return this.usersService.lastProducts();
  }

  @Get('defaultpage')
  @UseGuards(JwtAuthGuard)
  defaultProducts(@Req() req: any) {
    return this.usersService.defaultPage(req);
  }

  @Get('productspagination/:id')
  @UseGuards(JwtAuthGuard)
  products(@Param('id') id: number, @Req() req: any) {
    return this.usersService.paginationProducts(id, req);
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
}
