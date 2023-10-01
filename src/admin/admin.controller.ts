import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, UploadedFile, SetMetadata, Req, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { fileUploadInterceptor } from 'src/utils/file.catch';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { AdminGuard } from 'src/guards/checkrole.guard';

@Controller()
export class AdminController {

  constructor(private readonly adminService: AdminService) { }


  // @Post('addproducts')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(AdminGuard)
  // @UseInterceptors(fileUploadInterceptor('product_image'))
  // addProduct(@Body() createAdminDto: CreateProductDto, @UploadedFile() file: UploadedFileInter, @Req() req: any) {
  //   return this.adminService.addProducts(createAdminDto, file, req);
  // }



  // @Get('products')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(AdminGuard)
  // Products() {
  //   return this.adminService.allProducts();
  // }





}
