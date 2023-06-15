import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, UploadedFile, SetMetadata, Req, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto } from 'src/users/dto/products.dto';
import { fileUploadInterceptor } from 'src/utils/file.catch';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import UploadedFileInter from 'src/auth/entities/file.catch';
import { AdminGuard } from 'src/guards/checkrole.guard';
import { UpdateProductDto } from 'src/users/dto/update-user.dto';

@Controller()
export class AdminController {

  constructor(private readonly adminService: AdminService) { }


  @Post('addproducts')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(fileUploadInterceptor('product_image'))
  addProduct(@Body() createAdminDto: CreateProductDto, @UploadedFile() file: UploadedFileInter, @Req() req: any) {
    return this.adminService.addProducts(createAdminDto, file, req);
  }



  @Get('products')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  Products() {
    return this.adminService.allProducts();
  }

  @Get('product/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  Product(@Param('id') id: string) {
    return this.adminService.product(id);
  }

  @Put('product/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(fileUploadInterceptor('product_image'))
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: UploadedFileInter) {
    return this.adminService.updateProduct(id, updateProductDto, file);
  }



  @Delete('product/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  deleteProducts(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

}
