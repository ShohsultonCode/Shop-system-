import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, UploadedFile, SetMetadata, Req, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { fileUploadInterceptor } from 'src/utils/file.catch';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { AdminGuard } from 'src/guards/checkrole.guard';

//sss
@Controller()
export class AdminController {

  constructor(private readonly adminService: AdminService) { }

<<<<<<< HEAD
  //Products
  @Post('addproducts')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(fileUploadInterceptor('product_image'))
  addProduct(@Body() createAdminDto: CreateProductDto, @UploadedFile() file: UploadedFileInter, @Req() req: any) {
    return this.adminService.addProducts(createAdminDto, file, req);
  }
=======

  // @Post('addproducts')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(AdminGuard)
  // @UseInterceptors(fileUploadInterceptor('product_image'))
  // addProduct(@Body() createAdminDto: CreateProductDto, @UploadedFile() file: UploadedFileInter, @Req() req: any) {
  //   return this.adminService.addProducts(createAdminDto, file, req);
  // }
>>>>>>> 5399906b5f3c2d3ad0714afbfa97db980da8c5c9



  // @Get('products')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(AdminGuard)
  // Products() {
  //   return this.adminService.allProducts();
  // }





}
